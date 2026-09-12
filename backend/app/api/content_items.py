from fastapi import APIRouter

from app.services.content_item_service import (
    create_content_item,
    get_content_items,
)


router = APIRouter(
    prefix="/content-items",
    tags=["Content Items"],
)


@router.get("/{workspace_id}")
async def list_content_items(
    workspace_id: str,
):
    return get_content_items(
        workspace_id
    )


@router.post("/{workspace_id}")
async def create_item(
    workspace_id: str,
    title: str,
    topic: str,
    channel: str,
):
    return create_content_item(
        workspace_id=workspace_id,
        title=title,
        topic=topic,
        channel=channel,
    )