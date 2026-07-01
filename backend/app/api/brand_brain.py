from fastapi import APIRouter
from pydantic import BaseModel

from app.services.brand_brain_service import (
    ask_brand_brain,
)

from app.services.conversation_service import (
    get_conversation_history,
)


router = APIRouter(
    prefix="/brand-brain",
    tags=["Brand Brain"],
)


class BrandBrainRequest(
    BaseModel,
):
    workspace_id: str
    question: str


@router.post("/chat")
async def chat(
    request: BrandBrainRequest,
):
    return ask_brand_brain(
        request.question,
        request.workspace_id,
    )


@router.get(
    "/history/{workspace_id}",
)
async def history(
    workspace_id: str,
):
    return get_conversation_history(
        workspace_id,
    )