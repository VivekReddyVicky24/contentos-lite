from pydantic import BaseModel


class PublishRequest(
    BaseModel
):

    workspace_id: str

    platform: str

    title: str

    content: str