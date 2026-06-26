from fastapi import APIRouter
from fastapi import HTTPException

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
async def research(request: AgentRequest):

    try:

        result = graph.invoke(
            {
                "topic": request.topic,
            }
        )

        return result

    except HTTPException:

        raise

    except Exception as e:

        raise HTTPException(
            status_code=429,
            detail=str(e),
        )
