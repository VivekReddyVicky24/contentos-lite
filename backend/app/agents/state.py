from typing import Literal, TypedDict


class ContentState(TypedDict):
    topic: str

    research: str

    plan: dict

    seo: dict

    draft: dict

    edited_draft: dict

    approval_status: Literal[
        "pending",
        "approved",
        "rejected",
    ]

    reviewer_notes: str

    current_agent: str

    execution_log: list[str]

    failed: bool

    error_message: str