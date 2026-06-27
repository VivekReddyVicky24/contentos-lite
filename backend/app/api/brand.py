from fastapi import APIRouter
from fastapi import HTTPException

from app.schemas.brand import (
    BrandProfileCreate,
)

from app.services.brand_service import (
    create_brand_profile,
    get_brand_profile,
    update_brand_profile,
)

from app.guardrails.allowed_platforms import (
    validate_platforms,
)

router = APIRouter(
    prefix="/brand",
    tags=["Brand"],
)


@router.post("/")
async def create_brand(
    request: BrandProfileCreate,
):

    if not validate_platforms(
        request.preferred_platforms
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid platform detected.",
        )

    return create_brand_profile(
        request.model_dump()
    )


@router.get(
    "/{workspace_id}",
)
async def get_brand(
    workspace_id: str,
):

    return get_brand_profile(
        workspace_id
    )


@router.put(
    "/{workspace_id}",
)
async def update_brand(
    workspace_id: str,
    request: BrandProfileCreate,
):

    if not validate_platforms(
        request.preferred_platforms
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid platform detected.",
        )

    return update_brand_profile(
        workspace_id,
        request.model_dump(),
    )