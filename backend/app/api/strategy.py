from fastapi import (
    APIRouter,
    HTTPException,
)

from app.services.strategy_service import (
    get_saved_strategy,
    generate_strategy,
)

router = APIRouter(
    prefix="/strategy",
    tags=["Strategy"],
)


@router.get("/{workspace_id}")
async def get_strategy(
    workspace_id: str,
):

    return get_saved_strategy(
        workspace_id,
    )


@router.post("/{workspace_id}/regenerate")
async def regenerate_strategy(
    workspace_id: str,
):

    try:

        return generate_strategy(
            workspace_id,
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )