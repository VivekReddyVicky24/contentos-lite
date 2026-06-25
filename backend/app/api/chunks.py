from fastapi import APIRouter

from app.services.chunk_service import (
    chunk_text,
)

router = APIRouter()


@router.post("/test")
async def test_chunking():

    sample_text = (
        "A" * 2500
    )

    chunks = chunk_text(sample_text)

    return {
        "chunk_count": len(chunks),
        "sizes": [
            len(c)
            for c in chunks
        ],
    }