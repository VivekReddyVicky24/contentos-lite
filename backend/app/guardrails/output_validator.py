from app.guardrails.brand_policy import (
    violates_brand_policy,
)

from app.guardrails.pii import (
    contains_pii,
)

from app.guardrails.toxicity import (
    is_toxic,
)


def validate_output(
    text: str,
):

    if contains_pii(text):
        return False, "PII detected in output."

    if is_toxic(text):
        return False, "Toxic content detected in output."

    if violates_brand_policy(text):
        return False, "Brand policy violation."

    return True, None