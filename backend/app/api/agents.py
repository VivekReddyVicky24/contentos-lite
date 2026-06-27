from fastapi import APIRouter
from fastapi import HTTPException

from pydantic import BaseModel

from app.agents.graph import (
    graph,
)

from app.services.brand_service import (
    get_brand_profile_for_agent,
)

from app.guardrails.middleware import (
    validate_input,
)

router = APIRouter()


class ResearchRequest(
    BaseModel,
):
    topic: str
    workspace_id: str


@router.post("/research")
async def research(
    request: ResearchRequest,
):
    try:

        validate_input(
            request.topic
        )

        brand_profile = (
            get_brand_profile_for_agent(
                request.workspace_id
            )
        )

        result = graph.invoke(
            {
                "topic": request.topic,
                "brand_profile": brand_profile,
            }
        )

        return result

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=429,
            detail=str(e),
        )