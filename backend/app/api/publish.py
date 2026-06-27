from fastapi import APIRouter

from app.schemas.publish import (
    PublishRequest,
)
from app.services.publish_service import (
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