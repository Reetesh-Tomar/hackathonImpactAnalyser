"""
MODULE 2 — API surface for the local sanitization engine.

Exposed standalone so the frontend/CI pipeline can preview exactly what will
be redacted before an analysis is submitted (useful for a "here is what we
stripped" transparency panel in the UI), and so other backend services can
call it as a pre-flight check without invoking the full agent pipeline.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.security.sanitizer import RedactionReport, SanitizationError, default_sanitizer

router = APIRouter()


class SanitizeRequest(BaseModel):
    text: str = Field(..., description="Raw text to scan, e.g. a git diff or change description")
    strict: bool = Field(
        default=True,
        description="If true, reject (HTTP 422) instead of forwarding when residual risk remains",
    )


class SanitizeResponse(BaseModel):
    sanitized_text: str
    report: RedactionReport


@router.post("/security/sanitize", response_model=SanitizeResponse, tags=["Security"])
async def sanitize_text(request: SanitizeRequest):
    """
    Run the local PII/credential redaction engine over arbitrary text.

    This MUST be called (internally, by the pipeline) before any text is
    placed into a cloud LLM or embedding prompt. It never makes an outbound
    network call.
    """
    try:
        sanitized_text, report = default_sanitizer.sanitize(request.text, strict=request.strict)
        return SanitizeResponse(sanitized_text=sanitized_text, report=report)
    except SanitizationError as exc:
        raise HTTPException(
            status_code=422,
            detail={
                "message": str(exc),
                "report": exc.report.dict(),
            },
        )
