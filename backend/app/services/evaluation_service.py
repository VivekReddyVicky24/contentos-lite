from app.db.supabase import supabase


def save_evaluation(
    workspace_id: str,
    evaluation: dict,
):

    return (
        supabase
        .table("evaluations")
        .insert(
            {
                "workspace_id": workspace_id,
                "readability": evaluation.get(
                    "readability",
                    0,
                ),
                "brand_alignment": evaluation.get(
                    "brand_alignment",
                    0,
                ),
                "groundedness": evaluation.get(
                    "groundedness",
                    0,
                ),
            }
        )
        .execute()
    )


def get_workspace_evaluations(
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