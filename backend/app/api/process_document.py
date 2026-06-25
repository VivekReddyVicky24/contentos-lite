from fastapi import APIRouter

from app.services.document_processor import (
    process_document,
)

router = APIRouter()


@router.post("/test")
async def process_document_test():

    sample_text = (
        "ContentCrew is an AI Content Operating System. "
        * 300
    )

    result = process_document(
        document_id="f5866003-daac-4b58-8d12-24d129fcdc8e",
        workspace_id="dca8be19-226f-4e4a-86d0-8af114fdc743",
        raw_text=sample_text,
    )

    return result