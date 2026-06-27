def build_brand_context(
    brand: dict,
):

    if not brand:
        return ""

    return f"""
You MUST follow these brand instructions.

COMPANY:
{brand.get("company_name")}

BRAND VOICE:
{brand.get("brand_voice")}

TARGET AUDIENCE:
{brand.get("target_audience")}

CONTENT GOALS:
{brand.get("content_goals")}

PREFERRED PLATFORMS:
{", ".join(
    brand.get(
        "preferred_platforms",
        [],
    )
)}

All generated content must align with these instructions.
"""