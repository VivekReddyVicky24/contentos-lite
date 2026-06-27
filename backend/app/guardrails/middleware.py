from fastapi import HTTPException

from app.guardrails.brand_policy import (
    violates_brand_policy,
)
from app.guardrails.pii import (
    contains_pii,
)
from app.guardrails.prompt_injection import (
    detect_prompt_injection,
)
from app.guardrails.toxicity import (
    is_toxic,
)
from app.guardrails.content_size import (
    validate_content_size,
)
from app.services.guardrail_service import (
    log_guardrail_violation,
)
from app.guardrails.rate_limit import (
    check_rate_limit,
)


def validate_input(
    text: str,
    workspace_id: str | None = None,
):

    if workspace_id:

        allowed = check_rate_limit(
            workspace_id
        )

        if not allowed:

            log_guardrail_violation(
                workspace_id,
                "rate_limit",
                text,
            )

            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded.",
            )

    if not validate_content_size(
        text
    ):

        log_guardrail_violation(
            workspace_id,
            "content_too_large",
            text,
        )

        raise HTTPException(
            status_code=400,
            detail="Input exceeds 5000 characters.",
        )

    if detect_prompt_injection(text):

        log_guardrail_violation(
            workspace_id,
            "prompt_injection",
            text,
        )

        raise HTTPException(
            status_code=400,
            detail="Prompt injection detected.",
        )

    if contains_pii(text):

        log_guardrail_violation(
            workspace_id,
            "pii",
            text,
        )

        raise HTTPException(
            status_code=400,
            detail="PII detected.",
        )

    if is_toxic(text):

        log_guardrail_violation(
            workspace_id,
            "toxicity",
            text,
        )

        raise HTTPException(
            status_code=400,
            detail="Toxic content detected.",
        )

    if violates_brand_policy(text):

        log_guardrail_violation(
            workspace_id,
            "brand_policy",
            text,
        )

        raise HTTPException(
            status_code=400,
            detail="Brand policy violation detected.",
        )