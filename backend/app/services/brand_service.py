from app.db.supabase import supabase


def create_brand_profile(data):

    response = (
        supabase
        .table("brand_profiles")
        .insert(data)
        .execute()
    )

    return response.data


def get_brand_profile(
    workspace_id: str,
):

    response = (
        supabase
        .table("brand_profiles")
        .select("*")
        .eq(
            "workspace_id",
            workspace_id,
        )
        .limit(1)
        .execute()
    )

    if not response.data:
        return None

    return response.data[0]


def update_brand_profile(
    workspace_id: str,
    data,
):

    response = (
        supabase
        .table("brand_profiles")
        .update(data)
        .eq(
            "workspace_id",
            workspace_id,
        )
        .execute()
    )

    return response.data


def get_brand_profile_for_agent(
    workspace_id: str,
):

    response = (
        supabase
        .table("brand_profiles")
        .select("*")
        .eq(
            "workspace_id",
            workspace_id,
        )
        .limit(1)
        .execute()
    )

    if not response.data:
        return {}

    return response.data[0]