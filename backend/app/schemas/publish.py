from typing import Literal

from pydantic import BaseModel


class PublishRequest(
    BaseModel
):

    workspace_id: str

    platform: Literal[
        "medium",
        "wordpress",
        "ghost",
    ]

    title: str

    content: str