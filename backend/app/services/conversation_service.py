from typing import Any

from app.db.supabase import supabase


def save_message(workspace_id: str, role: str, message: str) -> dict[str, Any]:
    response = (
        supabase
        .table("brand_conversations")
        .insert(
            {
                "workspace_id": workspace_id,
                "role": role,
                "message": message,
            }
        )
        .execute()
    )

    if not response.data:
        return {}

    return response.data[0]


def get_conversation_history(workspace_id: str, limit: int = 20) -> list[dict[str, Any]]:
    response = (
        supabase
        .table("brand_conversations")
        .select("*")
        .eq("workspace_id", workspace_id)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )

    if not response.data:
        return []

    return sorted(response.data, key=lambda item: item.get("created_at", ""))
