from app.db.supabase import supabase

from app.publishers.ghost import (
    GhostPublisher,
)

from app.publishers.medium import (
    MediumPublisher,
)

from app.publishers.wordpress import (
    WordPressPublisher,
)


PUBLISHERS = {
    "medium": MediumPublisher(),
    "wordpress": WordPressPublisher(),
    "ghost": GhostPublisher(),
}


def publish_content(
    workspace_id: str,
    platform: str,
    title: str,
    content: str,
):
    publisher = PUBLISHERS.get(
        platform
    )

    if not publisher:
        raise ValueError(
            f"Unsupported publishing platform: {platform}"
        )

    result = publisher.publish(
        title,
        content,
    )

    supabase.table(
        "publications"
    ).insert(
        {
            "workspace_id":
                workspace_id,

            "platform":
                platform,

            "title":
                title,

            "content":
                content,

            "status":
                result["status"],

            "published_url":
                result.get("url"),
        }
    ).execute()

    return result


def get_publications(
    workspace_id: str,
):
    response = (
        supabase
        .table("publications")
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

    return response.data or []


def _content_to_text(
    content: dict,
) -> str:
    """
    Convert the structured AI-generated
    content JSON into publishable text.
    """

    parts = []

    introduction = content.get(
        "introduction"
    )

    if introduction:
        parts.append(
            introduction
        )

    sections = content.get(
        "sections",
        []
    )

    for section in sections:

        if not isinstance(
            section,
            dict,
        ):
            continue

        heading = section.get(
            "heading"
        )

        section_content = section.get(
            "content"
        )

        if heading:
            parts.append(
                f"\n## {heading}"
            )

        if section_content:
            parts.append(
                section_content
            )

    conclusion = content.get(
        "conclusion"
    )

    if conclusion:
        parts.append(
            f"\n## Conclusion\n{conclusion}"
        )

    call_to_action = content.get(
        "call_to_action"
    )

    if call_to_action:
        parts.append(
            f"\n{call_to_action}"
        )

    return "\n\n".join(
        parts
    )


def publish_content_item(
    content_item_id: str,
    platform: str,
):
    """
    Publish an approved ContentCrew
    content item using an existing
    publisher adapter.
    """

    item_response = (
        supabase
        .table("content_items")
        .select("*")
        .eq(
            "id",
            content_item_id,
        )
        .maybe_single()
        .execute()
    )

    item = item_response.data

    if not item:
        raise ValueError(
            "Content item not found."
        )

    if item.get("status") != "approved":
        raise ValueError(
            "Only approved content can be published."
        )

    content = item.get(
        "content"
    )

    if not content:
        raise ValueError(
            "No generated content exists for this item."
        )

    title = (
        content.get("title")
        or item.get("title")
    )

    publishable_content = (
        _content_to_text(content)
    )

    result = publish_content(
        workspace_id=item[
            "workspace_id"
        ],
        platform=platform,
        title=title,
        content=publishable_content,
    )

    # The existing publisher adapters currently
    # return "scheduled".
    new_status = result.get(
        "status",
        "scheduled",
    )

    supabase.table(
        "content_items"
    ).update(
        {
            "status": "published"
            if new_status == "published"
            else "scheduled",
        }
    ).eq(
        "id",
        content_item_id,
    ).execute()

    return {
        "success": True,
        "content_item_id":
            content_item_id,
        "platform":
            platform,
        "title":
            title,
        "status":
            new_status,
        "result":
            result,
    }