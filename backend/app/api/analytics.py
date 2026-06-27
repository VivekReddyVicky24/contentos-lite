from fastapi import APIRouter

from app.analytics.service import (
    get_workspace_analytics,
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get(
    "/{workspace_id}",
)
async def analytics(
    workspace_id: str,
):

    return get_workspace_analytics(
        workspace_id
    )