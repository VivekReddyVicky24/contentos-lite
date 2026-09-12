from fastapi import APIRouter

from app.services.content_plan_service import (
    generate_monthly_plan,
)


router = APIRouter(
    prefix="/content-plan",
    tags=["Content Plan"],
)


@router.get("/{workspace_id}")
async def get_monthly_plan(
    workspace_id: str,
):
    return generate_monthly_plan(
        workspace_id
    )