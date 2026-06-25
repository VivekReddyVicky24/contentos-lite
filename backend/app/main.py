from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.health import router as health_router
from app.api.documents import router as document_router
from app.api.pdf import router as pdf_router
from app.api.chunks import (
    router as chunk_router
)
from app.api.process import (
    router as process_router
)
from app.api.embeddings import (
    router as embedding_router
)
from app.api.search import (
    router as search_router
)
from app.api.process_document import (
    router as process_document_router
)
from app.api.brand_brain import (
    router as brand_brain_router,
)
from app.api.brand_brain_stream import (
    router as stream_router,
)




app = FastAPI(
    title="ContentCrew API",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

app.include_router(
    embedding_router,
    prefix="/embeddings",
    tags=["Embeddings"]
)

app.include_router(
    search_router,
    prefix="/search",
    tags=["Search"]
)

app.include_router(
    process_document_router,
    prefix="/process-document",
    tags=["Document Processing"]
)

app.include_router(
    brand_brain_router,
    prefix="/brand-brain",
    tags=["Brand Brain"],
)

app.include_router(
    stream_router,
    prefix="/brand-brain",
    tags=["Brand Brain Streaming"],
)

@app.get("/")
def root():
    return {
        "message": "ContentCrew Backend Running"
    }