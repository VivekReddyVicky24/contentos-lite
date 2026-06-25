from fastapi import APIRouter

from app.services.embedding_service import (
    generate_embedding,
)

router = APIRouter()


@router.post("/test")
async def test_embedding():

    embedding = generate_embedding(
        "ContentCrew is an AI content operating system."
    )

    return {
        "dimensions": len(
            embedding
        ),

        "preview": embedding[:5],
    }