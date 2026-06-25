from fastapi import APIRouter
from pydantic import BaseModel

from app.services.brand_brain_service import (
    ask_brand_brain,
)

router = APIRouter()


class BrandBrainRequest(
    BaseModel
):
    question: str
    workspace_id: str


@router.post("/query")
async def query_brand_brain(
    request: BrandBrainRequest,
):
    return ask_brand_brain(
        request.question,
        request.workspace_id,
    )