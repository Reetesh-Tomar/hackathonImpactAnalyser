"""
API surface for the v2 ReAct multi-agent pipeline (Modules 1-4 combined).

Kept on a distinct `/api/v2` prefix so the original mock 7-agent pipeline
(`/api/v1/change-impact/analyze`) keeps working unmodified for the existing
demo/dashboard while this hardened pipeline is developed alongside it.
"""

from fastapi import APIRouter, HTTPException

from app.agents.react.api_models import ChangeAnalysisRequestV2, FullAnalysisResponseV2
from app.agents.react.react_executor import default_executor
from app.security.sanitizer import SanitizationError

router = APIRouter()


@router.post(
    "/change-impact/analyze-react",
    response_model=FullAnalysisResponseV2,
    tags=["Change Impact V2 (ReAct)"],
)
async def analyze_change_impact_react(request: ChangeAnalysisRequestV2):
    """
    Run the 3-agent ReAct pipeline: Code Auditor -> Historical Detective ->
    Risk Synthesizer. Returns the strict JSON verdict plus full agent
    transcripts for audit purposes.
    """
    try:
        return default_executor.analyze(request)
    except SanitizationError as exc:
        raise HTTPException(
            status_code=422,
            detail={
                "message": "Input rejected: ambiguous high-risk content could not be safely redacted.",
                "report": exc.report.dict(),
            },
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
