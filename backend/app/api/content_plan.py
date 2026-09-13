from fastapi import APIRouter

from app.services.content_plan_service import (
    generate_monthly_plan,
    get_saved_monthly_plan,
)

router = APIRouter(
    prefix="/content-plan",
    tags=["Content Plan"],
)


@router.get("/{workspace_id}")
async def get_monthly_plan(workspace_id: str):
    """
    Fast read-only endpoint.
    Returns the already saved content plan.
    """
    return get_saved_monthly_plan(workspace_id)


@router.post("/{workspace_id}/regenerate")
async def regenerate_monthly_plan(workspace_id: str):
    """
    Explicitly generates a new AI content plan.
    """
    return generate_monthly_plan(workspace_id)