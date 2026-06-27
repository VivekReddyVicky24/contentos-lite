from fastapi import APIRouter

from app.schemas.publish import (
    PublishRequest,
)
from app.services.publish_service import (
    get_publications,
    publish_content,
)

router = APIRouter(
    prefix="/publish",
    tags=["Publish"],
)


@router.post("/")
async def publish(
    request: PublishRequest,
):

    return publish_content(
        request.workspace_id,
        request.platform,
        request.title,
        request.content,
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