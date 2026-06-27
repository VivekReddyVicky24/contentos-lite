from fastapi import APIRouter

from app.db.supabase import supabase


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

    response = (
        supabase
        .table("evaluations")
        .select("*")
        .eq(
            "workspace_id",
            workspace_id,
        )
        .order(
            "created_at",
            desc=True,
        )
        .execute()
    )

    return response.data