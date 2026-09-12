from fastapi import APIRouter

from app.services.strategy_service import (
    generate_strategy,
)

router = APIRouter(
    prefix="/strategy",
    tags=["Strategy"],
)


@router.get("/{workspace_id}")
async def get_strategy(
    workspace_id: str,
):

    return generate_strategy(
        workspace_id
    )