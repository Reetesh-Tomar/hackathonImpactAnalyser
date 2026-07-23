"""
MODULE 3 — GCP Vertex AI text embeddings for the RAG pipeline.

Generates text embeddings for incoming (already sanitized — see
app/security/sanitizer.py) code changes so they can be matched against the
historical incident vector index (app/rag/vector_search.py).

Design notes:
  - Import of `google-cloud-aiplatform` is guarded. In hackathon / mock mode,
    or in an environment with no GCP credentials configured, this module
    transparently falls back to the deterministic local embedding model
    already used elsewhere in this codebase (app/rag/embeddings.py), so the
    rest of the pipeline never has to special-case "no cloud credentials".
  - Batches requests (Vertex AI's textembedding-gecko endpoint accepts up to
    250 texts per request) and chunks larger batches automatically.
  - Wrapped with `tenacity` retry with exponential backoff for transient
    5xx/429 responses, matching production resilience expectations.
"""

from __future__ import annotations

import logging
import os
from typing import List, Optional

from app.rag.embeddings import EmbeddingService

logger = logging.getLogger(__name__)

VERTEX_MAX_BATCH_SIZE = 250
DEFAULT_VERTEX_MODEL = "text-embedding-005"


class VertexEmbeddingUnavailableError(Exception):
    """Raised internally when Vertex AI cannot be reached; callers should
    catch this and use the deterministic local fallback, never crash."""


class VertexAIEmbeddingClient:
    """
    Thin, defensive wrapper around Vertex AI's `TextEmbeddingModel`.

    Usage:
        client = VertexAIEmbeddingClient(project_id="my-bank-project", location="us-central1")
        vectors = client.embed_texts(["Upgrade Kafka cluster 3.4 to 3.7 for tdh-etl-services"])
    """

    def __init__(
        self,
        project_id: Optional[str] = None,
        location: str = "us-central1",
        model_name: str = DEFAULT_VERTEX_MODEL,
    ):
        self.project_id = project_id or os.getenv("GCP_PROJECT_ID", "")
        self.location = location or os.getenv("GCP_REGION", "us-central1")
        self.model_name = model_name or os.getenv("VERTEX_EMBEDDING_MODEL", DEFAULT_VERTEX_MODEL)
        self._model = None
        self._initialized = False

    def _lazy_init(self) -> None:
        """Initialize the Vertex AI SDK only on first real use (keeps import cost
        and cold-start latency at zero for local/mock-mode development)."""
        if self._initialized:
            return
        if not self.project_id:
            raise VertexEmbeddingUnavailableError("GCP_PROJECT_ID is not configured")

        try:
            import vertexai
            from vertexai.language_models import TextEmbeddingModel

            vertexai.init(project=self.project_id, location=self.location)
            self._model = TextEmbeddingModel.from_pretrained(self.model_name)
            self._initialized = True
        except ImportError as exc:
            raise VertexEmbeddingUnavailableError(
                "google-cloud-aiplatform is not installed; run "
                "`pip install google-cloud-aiplatform` to enable live Vertex AI embeddings"
            ) from exc
        except Exception as exc:  # ADC missing, permission denied, network unreachable, etc.
            raise VertexEmbeddingUnavailableError(f"Vertex AI initialization failed: {exc}") from exc

    def embed_texts(self, texts: List[str], task_type: str = "RETRIEVAL_DOCUMENT") -> List[List[float]]:
        """
        Embed a batch of (already sanitized) texts using Vertex AI.

        Raises VertexEmbeddingUnavailableError if Vertex AI cannot be used —
        callers must catch this and fall back to a local embedding provider.
        """
        self._lazy_init()

        all_vectors: List[List[float]] = []
        for batch_start in range(0, len(texts), VERTEX_MAX_BATCH_SIZE):
            batch = texts[batch_start:batch_start + VERTEX_MAX_BATCH_SIZE]
            vectors = self._embed_batch_with_retry(batch, task_type)
            all_vectors.extend(vectors)
        return all_vectors

    def _embed_batch_with_retry(self, batch: List[str], task_type: str) -> List[List[float]]:
        try:
            from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

            @retry(
                stop=stop_after_attempt(3),
                wait=wait_exponential(multiplier=1, min=1, max=8),
                retry=retry_if_exception_type(Exception),
                reraise=True,
            )
            def _do_embed():
                from vertexai.language_models import TextEmbeddingInput

                inputs = [TextEmbeddingInput(text=t, task_type=task_type) for t in batch]
                embeddings = self._model.get_embeddings(inputs)
                return [e.values for e in embeddings]

            return _do_embed()
        except ImportError:
            # tenacity not installed: degrade to a single attempt, no retry.
            from vertexai.language_models import TextEmbeddingInput

            inputs = [TextEmbeddingInput(text=t, task_type=task_type) for t in batch]
            embeddings = self._model.get_embeddings(inputs)
            return [e.values for e in embeddings]


class HybridEmbeddingProvider:
    """
    Production embedding provider used by the ReAct Historical Detective agent.

    Tries Vertex AI first (if configured). On ANY failure — missing
    credentials, package not installed, quota exceeded, network partition —
    it transparently falls back to the deterministic local embedding used by
    the rest of this codebase, so the demo (and CI) never depends on live
    GCP credentials being present.
    """

    def __init__(self, vertex_client: Optional[VertexAIEmbeddingClient] = None):
        self.vertex_client = vertex_client or VertexAIEmbeddingClient()
        self.local_fallback = EmbeddingService(provider="mock")
        self.last_provider_used = "uninitialized"

    def embed(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
        try:
            vectors = self.vertex_client.embed_texts(texts)
            self.last_provider_used = "vertex-ai"
            return vectors
        except VertexEmbeddingUnavailableError as exc:
            logger.info("Vertex AI embeddings unavailable, using local fallback: %s", exc)
            self.last_provider_used = "local-deterministic-fallback"
            return self.local_fallback.generate_embeddings(texts)
        except Exception as exc:  # unexpected error class from the SDK
            logger.warning("Unexpected Vertex AI embedding error, using local fallback: %s", exc)
            self.last_provider_used = "local-deterministic-fallback"
            return self.local_fallback.generate_embeddings(texts)

    def embed_one(self, text: str) -> List[float]:
        return self.embed([text])[0]


def build_change_embedding_text(
    change_title: str,
    change_description: str,
    target_component: str,
    change_type: str,
    touched_symbols: Optional[List[str]] = None,
) -> str:
    """
    Compose the canonical text representation of a code change that gets
    embedded and matched against the historical incident index. Keeping this
    composition centralized ensures embedding-time and query-time text
    construction never drift apart (a common RAG bug).
    """
    symbols_fragment = ""
    if touched_symbols:
        symbols_fragment = " Touched symbols: " + ", ".join(touched_symbols[:20])
    return (
        f"Change: {change_title}. Type: {change_type}. "
        f"Target component: {target_component}. "
        f"Description: {change_description}.{symbols_fragment}"
    ).strip()
