from fastapi import APIRouter, UploadFile, File
import tempfile
import os

from app.services.pdf_service import (
    extract_pdf_text,
)

router = APIRouter()


@router.post("/extract")
async def extract_pdf(
    file: UploadFile = File(...)
):
    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".pdf"
    ) as temp_file:

        temp_file.write(
            await file.read()
        )

        temp_path = temp_file.name

    try:
        text = extract_pdf_text(
            temp_path
        )

        return {
            "characters": len(text),
            "preview": text[:1000],
        }

    finally:
        os.remove(temp_path)