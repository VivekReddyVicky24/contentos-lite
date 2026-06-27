BRAND_BLOCKED_WORDS = [
    "guaranteed profits",
    "get rich quick",
    "100% success",
    "instant results",
]


def violates_brand_policy(
    text: str,
) -> bool:

    text = text.lower()

    return any(
        phrase in text
        for phrase in BRAND_BLOCKED_WORDS
    )