from fastapi import APIRouter, HTTPException

from app.services.content_item_service import (
    create_content_item,
    get_content_items,
    get_content_item,
    approve_content_item,
    reject_content_item,
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


@router.get("/item/{content_item_id}")
async def get_item(
    content_item_id: str,
):
    item = get_content_item(
        content_item_id
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Content item not found.",
        )

    return item


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


@router.post("/{content_item_id}/approve")
async def approve_item(
    content_item_id: str,
    reviewer_notes: str = "",
):
    item = get_content_item(
        content_item_id
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Content item not found.",
        )

    if not item.get("content"):
        raise HTTPException(
            status_code=400,
            detail="Content has not been generated yet.",
        )

    return approve_content_item(
        content_item_id,
        reviewer_notes,
    )


@router.post("/{content_item_id}/reject")
async def reject_item(
    content_item_id: str,
    reviewer_notes: str = "",
):
    item = get_content_item(
        content_item_id
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Content item not found.",
        )

    return reject_content_item(
        content_item_id,
        reviewer_notes,
    )