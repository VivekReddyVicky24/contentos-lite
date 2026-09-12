from app.db.supabase import supabase


def create_content_item(
    workspace_id: str,
    title: str,
    topic: str,
    channel: str,
    strategy_id: str | None = None,
    scheduled_date: str | None = None,
):
    payload = {
        "workspace_id": workspace_id,
        "strategy_id": strategy_id,
        "title": title,
        "topic": topic,
        "channel": channel,
        "status": "planned",
        "scheduled_date": scheduled_date,
    }

    response = (
        supabase
        .table("content_items")
        .insert(payload)
        .execute()
    )

    if not response.data:
        return {}

    return response.data[0]


def get_content_items(
    workspace_id: str,
):
    response = (
        supabase
        .table("content_items")
        .select("*")
        .eq(
            "workspace_id",
            workspace_id,
        )
        .order(
            "created_at",
            desc=False,
        )
        .execute()
    )

    return response.data or []


def update_content_item_status(
    content_item_id: str,
    status: str,
):
    response = (
        supabase
        .table("content_items")
        .update(
            {
                "status": status,
            }
        )
        .eq(
            "id",
            content_item_id,
        )
        .execute()
    )

    if not response.data:
        return {}

    return response.data[0]