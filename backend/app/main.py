from fastapi import FastAPI
from app.api.health import router as health_router
from app.api.documents import router as document_router

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

@app.get("/")
def root():
    return {
        "message": "ContentCrew Backend Running"
    }