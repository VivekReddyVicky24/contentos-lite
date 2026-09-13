from typing import Literal, TypedDict


class ContentState(TypedDict, total=False):

    # Content item being generated
    content_item_id: str

    # Workspace
    workspace_id: str

    # Input
    topic: str

    # Context
    brand_profile: dict

    # Pipeline outputs
    research: str

    plan: dict

    seo: dict

    draft: dict

    edited_draft: dict

    evaluation: dict

    # Approval
    approval_status: Literal[
        "pending",
        "approved",
        "rejected",
    ]

    reviewer_notes: str

    # Pipeline tracking
    current_agent: str

    execution_log: list[str]

    # Error handling
    failed: bool

    error_message: str