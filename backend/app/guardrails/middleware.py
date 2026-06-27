from fastapi import HTTPException

from app.guardrails.pii import (
    contains_pii,
)

from app.guardrails.prompt_injection import (
    detect_prompt_injection,
)

from app.guardrails.toxicity import (
    is_toxic,
)


def validate_input(
    text: str,
):

    if detect_prompt_injection(
        text,
    ):
        raise HTTPException(
            status_code=400,
            detail="Prompt injection detected.",
        )

    if contains_pii(
        text,
    ):
        raise HTTPException(
            status_code=400,
            detail="PII detected.",
        )

    if is_toxic(
        text,
    ):
        raise HTTPException(
            status_code=400,
            detail="Toxic content detected.",
        )