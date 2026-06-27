from app.analytics.aggregator import (
    calculate_average,
)
from app.db.supabase import supabase


def get_workspace_analytics(
    workspace_id: str,
):

    evaluations = (
        supabase
        .table("evaluations")
        .select("*")
        .eq(
            "workspace_id",
            workspace_id,
        )
        .execute()
    ).data

    publications = (
        supabase
        .table("publications")
        .select("*")
        .eq(
            "workspace_id",
            workspace_id,
        )
        .execute()
    ).data

    return {
        "content_generated":
            len(evaluations),

        "content_published":
            len(publications),

        "average_readability":
            calculate_average(
                [
                    e["readability"]
                    for e in evaluations
                ]
            ),

        "average_brand_alignment":
            calculate_average(
                [
                    e["brand_alignment"]
                    for e in evaluations
                ]
            ),

        "average_groundedness":
            calculate_average(
                [
                    e["groundedness"]
                    for e in evaluations
                ]
            ),
    }