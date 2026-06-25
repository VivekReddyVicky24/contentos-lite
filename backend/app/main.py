from fastapi import FastAPI
from app.api.health import router as health_router
from app.api.documents import router as document_router
from app.api.pdf import router as pdf_router
from app.api.chunks import (
    router as chunk_router
)
from app.api.process import (
    router as process_router
)

app = FastAPI(
    title="ContentCrew API",
    version="1.0.0"
)

app.include_router(
    health_router,
    prefix="/health",
    tags=["Health"]
)

app.include_router(
    document_router,
    prefix="/documents",
    tags=["Documents"]
)

app.include_router(
    pdf_router,
    prefix="/pdf",
    tags=["PDF"]
)

app.include_router(
    chunk_router,
    prefix="/chunks",
    tags=["Chunks"]
)

app.include_router(
    process_router,
    prefix="/process",
    tags=["Processing"]
)

@app.get("/")
def root():
    return {
        "message": "ContentCrew Backend Running"
    }