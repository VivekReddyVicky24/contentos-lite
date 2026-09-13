from fastapi import APIRouter, HTTPException

from app.schemas.publish import (
    PublishRequest,
    PublishContentItemRequest,
)

from app.services.publish_service import (
    get_publications,
    publish_content,
    publish_content_item,
)


router = APIRouter(
    prefix="/publish",
    tags=["Publish"],
)


@router.post("/")
async def publish(
    request: PublishRequest,
):
    try:

        return publish_content(
            request.workspace_id,
            request.platform,
            request.title,
            request.content,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "/{workspace_id}",
)
async def publications(
    workspace_id: str,
):
    return get_publications(
        workspace_id
    )


@router.post(
    "/content-item/{content_item_id}"
)
async def publish_content_item_endpoint(
    content_item_id: str,
    request: PublishContentItemRequest,
):

    try:

        return publish_content_item(
            content_item_id,
            request.platform,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )