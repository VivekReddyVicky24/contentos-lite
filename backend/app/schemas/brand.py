from pydantic import BaseModel


class BrandProfileCreate(
    BaseModel
):

    workspace_id: str

    company_name: str

    brand_voice: str

    target_audience: str

    content_goals: str

    preferred_platforms: list[str]

class BrandProfileResponse(
    BrandProfileCreate,
):
    id: str