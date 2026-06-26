from pydantic import BaseModel


class PipelineMetadata(
    BaseModel):

    version: str = "v1"

    total_agents: int = 5

    requires_approval: bool = True

    publish_ready: bool = False