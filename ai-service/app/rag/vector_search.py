"""
MODULE 3 — Semantic vector search over the historical incident log database.

This is the tool the Historical Detective ReAct agent calls
(`vector_search_incidents`) to autonomously retrieve the top-k "Similar
Historical Outages" and their "Mitigations Used" for a given code change.

Backing store: Chroma (embedded, on-disk, zero external services required —
ideal for a hackathon demo and for a bank's air-gapped environments). The
interface is intentionally storage-agnostic (`VectorIndex` ABC) so swapping
in Pinecone or Vertex AI Vector Search in production is a one-class change,
not a rewrite of the agent logic.
"""

from __future__ import annotations

import logging
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

from app.rag.data_loader import DataLoader
from app.rag.vertex_embeddings import HybridEmbeddingProvider, build_change_embedding_text

logger = logging.getLogger(__name__)

CHROMA_PERSIST_DIR = Path(__file__).parent.parent.parent / "data" / "chroma_incident_index"
INCIDENT_COLLECTION_NAME = "tdh_historical_incidents"


# ---------------------------------------------------------------------------
# Result contracts
# ---------------------------------------------------------------------------

class MitigationUsed(BaseModel):
    incident_id: str
    action: str


class SimilarHistoricalOutage(BaseModel):
    incident_id: str
    title: str
    service: str
    severity: str
    root_cause: str
    similarity_score: float = Field(..., ge=0.0, le=1.0)
    mitigation_used: str
    occurred_at: Optional[str] = None


class HistoricalSearchResult(BaseModel):
    query_text: str
    top_k: int
    results: List[SimilarHistoricalOutage]
    index_backend: str
    embedding_provider: str


# ---------------------------------------------------------------------------
# Storage-agnostic vector index interface
# ---------------------------------------------------------------------------

class VectorIndex(ABC):
    @abstractmethod
    def upsert(self, ids: List[str], embeddings: List[List[float]], metadatas: List[Dict[str, Any]]) -> None:
        ...

    @abstractmethod
    def query(self, embedding: List[float], top_k: int) -> List[Dict[str, Any]]:
        """Return a list of {id, metadata, distance} dicts, best match first."""
        ...

    @abstractmethod
    def count(self) -> int:
        ...


class ChromaVectorIndex(VectorIndex):
    """Embedded Chroma-backed vector index persisted to local disk."""

    def __init__(self, persist_directory: Path = CHROMA_PERSIST_DIR, collection_name: str = INCIDENT_COLLECTION_NAME):
        self.persist_directory = persist_directory
        self.collection_name = collection_name
        self._client = None
        self._collection = None

    def _ensure_client(self):
        if self._collection is not None:
            return
        import chromadb

        self.persist_directory.mkdir(parents=True, exist_ok=True)
        self._client = chromadb.PersistentClient(path=str(self.persist_directory))
        self._collection = self._client.get_or_create_collection(name=self.collection_name)

    def upsert(self, ids: List[str], embeddings: List[List[float]], metadatas: List[Dict[str, Any]]) -> None:
        self._ensure_client()
        documents = [m.get("title", "") for m in metadatas]
        self._collection.upsert(ids=ids, embeddings=embeddings, metadatas=metadatas, documents=documents)

    def query(self, embedding: List[float], top_k: int) -> List[Dict[str, Any]]:
        self._ensure_client()
        response = self._collection.query(query_embeddings=[embedding], n_results=top_k)
        results = []
        ids = response.get("ids", [[]])[0]
        metadatas = response.get("metadatas", [[]])[0]
        distances = response.get("distances", [[]])[0]
        for idx, metadata, distance in zip(ids, metadatas, distances):
            results.append({"id": idx, "metadata": metadata, "distance": distance})
        return results

    def count(self) -> int:
        self._ensure_client()
        return self._collection.count()


class InMemoryCosineIndex(VectorIndex):
    """
    Deterministic, dependency-free fallback used when `chromadb` is not
    installed (e.g. minimal CI containers) or when running fully offline.
    Linear scan is acceptable here: the incident corpus is bounded (hundreds
    to low thousands of rows), not millions.
    """

    def __init__(self):
        self._ids: List[str] = []
        self._embeddings: List[List[float]] = []
        self._metadatas: List[Dict[str, Any]] = []

    def upsert(self, ids: List[str], embeddings: List[List[float]], metadatas: List[Dict[str, Any]]) -> None:
        self._ids.extend(ids)
        self._embeddings.extend(embeddings)
        self._metadatas.extend(metadatas)

    def query(self, embedding: List[float], top_k: int) -> List[Dict[str, Any]]:
        import numpy as np

        if not self._embeddings:
            return []
        query_vec = np.array(embedding)
        query_norm = np.linalg.norm(query_vec) or 1.0

        scored = []
        for idx, emb, meta in zip(self._ids, self._embeddings, self._metadatas):
            vec = np.array(emb)
            denom = (np.linalg.norm(vec) * query_norm) or 1.0
            cosine_sim = float(np.dot(query_vec, vec) / denom)
            scored.append((cosine_sim, idx, meta))

        scored.sort(key=lambda t: t[0], reverse=True)
        return [
            {"id": idx, "metadata": meta, "distance": 1.0 - sim}
            for sim, idx, meta in scored[:top_k]
        ]

    def count(self) -> int:
        return len(self._ids)


# ---------------------------------------------------------------------------
# High-level service used by the Historical Detective agent
# ---------------------------------------------------------------------------

class IncidentVectorSearchService:
    """
    Builds (once, lazily) and queries a semantic vector index over
    `ai-service/data/incidents.json` + runbook mitigation text.
    """

    def __init__(
        self,
        data_loader: Optional[DataLoader] = None,
        embedding_provider: Optional[HybridEmbeddingProvider] = None,
        prefer_chroma: bool = True,
    ):
        self.data_loader = data_loader or DataLoader()
        self.embeddings = embedding_provider or HybridEmbeddingProvider()
        self.index: VectorIndex = self._build_index(prefer_chroma)
        self._indexed = False

    def _build_index(self, prefer_chroma: bool) -> VectorIndex:
        if prefer_chroma:
            try:
                import chromadb  # noqa: F401
                return ChromaVectorIndex()
            except ImportError:
                logger.info("chromadb not installed; using in-memory cosine index fallback")
        return InMemoryCosineIndex()

    def _ensure_indexed(self) -> None:
        if self._indexed and self.index.count() > 0:
            return

        incidents = self.data_loader.get_incidents()
        if not incidents:
            self._indexed = True
            return

        texts = [
            f"{inc.get('title', '')}. {inc.get('description', '')}. "
            f"Root cause: {inc.get('rootCause', 'unknown')}. Service: {inc.get('service', 'unknown')}."
            for inc in incidents
        ]
        vectors = self.embeddings.embed(texts)
        ids = [str(inc.get("id", f"incident-{i}")) for i, inc in enumerate(incidents)]
        metadatas = [
            {
                "incident_id": str(inc.get("id", f"incident-{i}")),
                "title": inc.get("title", ""),
                "service": inc.get("service", "unknown"),
                "severity": inc.get("severity", "unknown"),
                "root_cause": inc.get("rootCause", ""),
                "mitigation_used": inc.get("resolution", "No documented mitigation on file"),
                "occurred_at": inc.get("date", inc.get("occurredAt", "")),
            }
            for i, inc in enumerate(incidents)
        ]

        self.index.upsert(ids=ids, embeddings=vectors, metadatas=metadatas)
        self._indexed = True

    def find_similar_outages(
        self,
        change_title: str,
        change_description: str,
        target_component: str,
        change_type: str,
        touched_symbols: Optional[List[str]] = None,
        top_k: int = 3,
    ) -> HistoricalSearchResult:
        """
        Autonomous tool entry point for the Historical Detective agent:
        embed the (sanitized) change context and retrieve the top-k most
        similar historical outages, each paired with the mitigation used.
        """
        self._ensure_indexed()

        query_text = build_change_embedding_text(
            change_title, change_description, target_component, change_type, touched_symbols
        )
        query_embedding = self.embeddings.embed_one(query_text)
        raw_matches = self.index.query(query_embedding, top_k=top_k)

        results: List[SimilarHistoricalOutage] = []
        for match in raw_matches:
            meta = match["metadata"]
            distance = match.get("distance", 1.0)
            similarity = max(0.0, min(1.0, 1.0 - distance))
            results.append(
                SimilarHistoricalOutage(
                    incident_id=meta.get("incident_id", match["id"]),
                    title=meta.get("title", "Untitled incident"),
                    service=meta.get("service", "unknown"),
                    severity=meta.get("severity", "unknown"),
                    root_cause=meta.get("root_cause", ""),
                    similarity_score=round(similarity, 4),
                    mitigation_used=meta.get("mitigation_used", "No documented mitigation on file"),
                    occurred_at=meta.get("occurred_at") or None,
                )
            )

        return HistoricalSearchResult(
            query_text=query_text,
            top_k=top_k,
            results=results,
            index_backend=type(self.index).__name__,
            embedding_provider=self.embeddings.last_provider_used,
        )


# Module-level singleton: the incident corpus is small and static per process
# lifetime, so re-embedding it on every request would be wasteful.
_default_service: Optional[IncidentVectorSearchService] = None


def get_incident_vector_search_service() -> IncidentVectorSearchService:
    global _default_service
    if _default_service is None:
        _default_service = IncidentVectorSearchService()
    return _default_service


# ---------------------------------------------------------------------------
# Mock query snippet (Module 3 deliverable) — runnable standalone example
# ---------------------------------------------------------------------------

def mock_query_example() -> HistoricalSearchResult:
    """
    Standalone example showing the exact call the Historical Detective agent
    makes: given a proposed Kafka cluster upgrade, retrieve the top 3 most
    similar historical outages and their mitigations.

    Run with: `python -m app.rag.vector_search`
    """
    service = get_incident_vector_search_service()
    return service.find_similar_outages(
        change_title="Upgrade Kafka Cluster 3.4 to 3.7",
        change_description="Rolling upgrade of Kafka cluster used by TDH ETL and orchestration",
        target_component="kafka-tdh-cluster",
        change_type="KAFKA_UPGRADE",
        touched_symbols=["KafkaConsumerConfig", "InterBrokerProtocolVersion"],
        top_k=3,
    )


if __name__ == "__main__":
    result = mock_query_example()
    print(result.model_dump_json(indent=2))
