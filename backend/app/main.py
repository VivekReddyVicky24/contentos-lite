from fastapi import FastAPI
from app.api.health import router as health_router

app = FastAPI(
    title="ContentCrew API",
    version="1.0.0"
)

app.include_router(
    health_router,
    prefix="/health",
    tags=["Health"]
)

@app.get("/")
def root():
    return {
        "message": "ContentCrew Backend Running"
    }