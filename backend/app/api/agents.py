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


class ContentGenerationRequest(
    BaseModel,
):
    topic: str
    workspace_id: str
    content_item_id: str | None = None


@router.post("/research")
async def research(
    request: ContentGenerationRequest,
):
    try:

        validate_input(
            request.topic,
            request.workspace_id,
        )

        brand_profile = (
            get_brand_profile_for_agent(
                request.workspace_id
            )
        )

        brand_profile = {
            **brand_profile,
            "workspace_id": request.workspace_id,
        }

        initial_state = {
            "topic": request.topic,
            "workspace_id": request.workspace_id,
            "brand_profile": brand_profile,
            "content_item_id": request.content_item_id,
            "execution_log": [],
            "failed": False,
            "error_message": "",
            "approval_status": "pending",
        }

        result = graph.invoke(
            initial_state
        )

        return result

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )