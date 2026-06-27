TOXIC_WORDS = [

    "hate",

    "kill",

    "violence",

    "terrorist",

    "racist",
]


def is_toxic(
    text: str,
) -> bool:

    text = text.lower()

    return any(
        word in text
        for word in TOXIC_WORDS
    )