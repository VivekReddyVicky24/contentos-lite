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

    publisher = PUBLISHERS[
        platform
    ]

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

            "status":
                result["status"],
        }
    ).execute()

    return result