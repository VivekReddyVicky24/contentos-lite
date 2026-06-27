from fastapi import APIRouter

from app.services.evaluation_service import (
    get_workspace_evaluations,
)

router = APIRouter(
    prefix="/evaluations",
    tags=["Evaluations"],
)


@router.get(
    "/{workspace_id}",
)
async def get_evaluations(
    workspace_id: str,
):

    return get_workspace_evaluations(
        workspace_id
    )