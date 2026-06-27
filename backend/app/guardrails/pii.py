import re


EMAIL_REGEX = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"

PHONE_REGEX = r"\b\d{10}\b"


def contains_pii(
    text: str,
) -> bool:

    if re.search(
        EMAIL_REGEX,
        text,
    ):
        return True

    if re.search(
        PHONE_REGEX,
        text,
    ):
        return True

    return False