from fastapi import APIRouter

from app.services.search_service import (
    semantic_search,
)

router = APIRouter()


@router.get("/test")
async def test_search(
    workspace_id: str,
):
    results = semantic_search(
        "What is this company about?",
        workspace_id,
    )

    return results