from fastapi import APIRouter

from pydantic import BaseModel

from app.agents.graph import (
    graph,
)

router = APIRouter()


class AgentRequest(
    BaseModel,
):
    topic: str


@router.post("/research")
async def research(
    request: AgentRequest,
):
    result = graph.invoke(
        {
            "topic": request.topic,
        }
    )

    return result