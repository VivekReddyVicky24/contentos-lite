INJECTION_PATTERNS = [

    "ignore previous instructions",

    "forget all instructions",

    "system prompt",

    "reveal your prompt",

    "bypass safety",

    "act as root",

    "jailbreak",

    "developer message",

    "you are chatgpt",

    "disable guardrails",
]


def detect_prompt_injection(
    text: str,
) -> bool:

    text = text.lower()

    return any(
        pattern in text
        for pattern in INJECTION_PATTERNS
    )