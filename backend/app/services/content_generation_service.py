from datetime import datetime, timezone

from app.agents.graph import graph

from app.db.supabase import supabase

from app.services.brand_service import (
    get_brand_profile_for_agent,
)

from app.services.content_item_service import (
    get_content_item,
)


def generate_content_for_item(
    content_item_id: str,
):
    """
    Generate content for an existing queue item
    using the existing LangGraph pipeline.

    The generated result is persisted against the
    same content_items record.
    """

    content_item = get_content_item(
        content_item_id
    )

    if not content_item:
        raise ValueError(
            "Content item not found."
        )

    workspace_id = content_item[
        "workspace_id"
    ]

    topic = content_item.get(
        "topic"
    )

    if not topic:
        topic = content_item.get(
            "title",
            ""
        )

    # Mark item as generating
    supabase.table(
        "content_items"
    ).update(
        {
            "status": "generating",
        }
    ).eq(
        "id",
        content_item_id,
    ).execute()

    try:

        brand_profile = (
            get_brand_profile_for_agent(
                workspace_id
            )
        )

        brand_profile = {
            **brand_profile,
            "workspace_id": workspace_id,
        }

        initial_state = {
            "content_item_id": content_item_id,
            "workspace_id": workspace_id,
            "topic": topic,
            "brand_profile": brand_profile,
            "execution_log": [],
            "failed": False,
            "error_message": "",
            "approval_status": "pending",
        }

        result = graph.invoke(
            initial_state
        )

        edited_content = result.get(
            "edited_draft",
            {}
        )

        evaluation = result.get(
            "evaluation",
            {}
        )

        failed = result.get(
            "failed",
            False
        )

        if failed:
            supabase.table(
                "content_items"
            ).update(
                {
                    "status": "generation_failed",
                    "evaluation": evaluation,
                }
            ).eq(
                "id",
                content_item_id,
            ).execute()

        else:

            supabase.table(
                "content_items"
            ).update(
                {
                    "content": edited_content,
                    "evaluation": evaluation,
                    "status": "awaiting_approval",
                    "generated_at": datetime.now(
                        timezone.utc
                    ).isoformat(),
                }
            ).eq(
                "id",
                content_item_id,
            ).execute()

        return result

    except Exception:

        supabase.table(
            "content_items"
        ).update(
            {
                "status": "generation_failed",
            }
        ).eq(
            "id",
            content_item_id,
        ).execute()

        raise