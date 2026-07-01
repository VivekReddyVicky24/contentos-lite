from app.db.supabase import supabase
from app.services.llm_service import generate_text


def get_memory_summary(
    workspace_id: str,
) -> str:

    response = (
        supabase
        .table("brand_memory")
        .select("summary")
        .eq(
            "workspace_id",
            workspace_id,
        )
        .limit(1)
        .execute()
    )

    if not response.data:
        return ""

    return (
        response.data[0]
        .get("summary", "")
        or ""
    )


def update_memory_summary(
    workspace_id: str,
) -> str:

    history_response = (
        supabase
        .table("brand_conversations")
        .select(
            "role",
            "message",
            "created_at",
        )
        .eq(
            "workspace_id",
            workspace_id,
        )
        .order(
            "created_at",
            desc=True,
        )
        .limit(20)
        .execute()
    )

    messages = (
        history_response.data
        or []
    )

    messages = sorted(
        messages,
        key=lambda x: x.get(
            "created_at",
            "",
        ),
    )

    if not messages:

        summary = (
            "No memory available yet."
        )

    else:

        transcript = "\n".join(
            f'{m["role"]}: {m["message"]}'
            for m in messages
        )

        prompt = f"""
You are summarizing a brand workspace.

Create a memory summary under 500 words.

Include:

- important topics
- decisions made
- brand preferences
- unresolved questions

Use bullet points.

TRANSCRIPT:

{transcript}

SUMMARY:
"""

        summary = (
            generate_text(prompt)
            .strip()
        )

    (
        supabase
        .table("brand_memory")
        .upsert(
            {
                "workspace_id":
                    workspace_id,

                "summary":
                    summary,
            },
            on_conflict=
                "workspace_id",
        )
        .execute()
    )

    return summary