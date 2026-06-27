from app.guardrails.brand_policy import (
    violates_brand_policy,
)

from app.guardrails.pii import (
    contains_pii,
)

from app.guardrails.toxicity import (
    is_toxic,
)


from app.services.guardrail_service import (
    log_guardrail_violation,
)


def validate_output(
    text: str,
    workspace_id: str | None = None,
):

    if contains_pii(text):

        log_guardrail_violation(
            workspace_id,
            "output_pii",
            "",
            text,
        )

        return False, "PII detected in output."

    if is_toxic(text):

        log_guardrail_violation(
            workspace_id,
            "output_toxicity",
            "",
            text,
        )

        return False, "Toxic content detected."

    if violates_brand_policy(text):

        log_guardrail_violation(
            workspace_id,
            "output_brand_policy",
            "",
            text,
        )

        return False, "Brand policy violation."

    return True, None