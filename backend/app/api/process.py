from fastapi import APIRouter

from app.services.chunk_service import (
    chunk_text,
)

from app.services.document_chunk_service import (
    save_chunks,
)

router = APIRouter()


@router.post("/test")
async def process_test():

    sample_text = (
        "ContentCrew AI SaaS " * 200
    )

    chunks = chunk_text(
        sample_text
    )

    return {
        "chunk_count": len(chunks),
        "preview": chunks[0][:200],
    }