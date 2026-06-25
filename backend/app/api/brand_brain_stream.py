from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from pydantic import BaseModel

from app.services.search_service import (
    semantic_search,
)

from app.services.llm_stream_service import (
    stream_grounded_response,
)

router = APIRouter()


class StreamRequest(
    BaseModel,
):
    question: str
    workspace_id: str


@router.post("/stream")
async def stream_query(
    request: StreamRequest,
):

    chunks = semantic_search(
        request.question,
        request.workspace_id,
    )

    context = "\n\n".join(
        chunk["content"]
        for chunk in chunks
    )

    generator = stream_grounded_response(
        request.question,
        context,
    )

    return StreamingResponse(
        generator,
        media_type="text/plain",
    )