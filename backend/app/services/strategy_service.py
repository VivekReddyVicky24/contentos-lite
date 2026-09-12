import json
import re

from app.analytics.service import (
    get_workspace_analytics,
)

from app.db.supabase import (
    supabase,
)

from app.services.brand_service import (
    get_brand_profile,
)

from app.services.llm_service import (
    generate_text,
)

from app.services.memory_service import (
    get_memory_summary,
)

from app.services.search_service import (
    semantic_search,
)


DEFAULT_STRATEGY = {
    "monthly_objectives": [],
    "content_themes": [],
    "recommended_channels": [],
    "weekly_plan": [],
    "campaign_ideas": [],
}


def _ensure_list(value):

    if isinstance(value, list):
        return value

    if value is None:
        return []

    return [value]


def _normalize_weekly_plan(plans):

    normalized = []

    for index, item in enumerate(plans):

        if isinstance(item, dict):

            normalized.append(
                {
                    "week": item.get(
                        "week",
                        index + 1,
                    ),

                    "topic": item.get(
                        "topic",
                        "",
                    ),

                    "channel": item.get(
                        "channel",
                        "",
                    ),
                }
            )

        else:

            normalized.append(
                {
                    "week": index + 1,
                    "topic": str(item),
                    "channel": "",
                }
            )

    return normalized


def _parse_strategy_payload(
    raw_response: str,
):

    if not raw_response:
        return dict(DEFAULT_STRATEGY)

    cleaned = raw_response.strip()

    if cleaned.startswith("```"):

        cleaned = re.sub(
            r"^```(?:json)?\s*",
            "",
            cleaned,
        )

        cleaned = re.sub(
            r"\s*```$",
            "",
            cleaned,
        )

        cleaned = cleaned.strip()

    try:

        parsed = json.loads(cleaned)

    except Exception:

        match = re.search(
            r"\{.*\}",
            cleaned,
            re.DOTALL,
        )

        if not match:
            return dict(DEFAULT_STRATEGY)

        try:
            parsed = json.loads(
                match.group(0)
            )

        except Exception:
            return dict(DEFAULT_STRATEGY)

    if not isinstance(parsed, dict):
        return dict(DEFAULT_STRATEGY)

    return {
        "monthly_objectives":
            _ensure_list(
                parsed.get(
                    "monthly_objectives"
                )
            ),

        "content_themes":
            _ensure_list(
                parsed.get(
                    "content_themes"
                )
            ),

        "recommended_channels":
            _ensure_list(
                parsed.get(
                    "recommended_channels"
                )
            ),

        "weekly_plan":
            _normalize_weekly_plan(
                _ensure_list(
                    parsed.get(
                        "weekly_plan"
                    )
                )
            ),

        "campaign_ideas":
            _ensure_list(
                parsed.get(
                    "campaign_ideas"
                )
            ),
    }


def generate_strategy(
    workspace_id: str,
):

    brand_profile = (
        get_brand_profile(
            workspace_id
        )
        or {}
    )

    memory_summary = (
        get_memory_summary(
            workspace_id
        )
        or ""
    )

    analytics = (
        get_workspace_analytics(
            workspace_id
        )
        or {}
    )

    documents = (
        semantic_search(
            "brand strategy",
            workspace_id,
        )
        or []
    )

    document_context = []

    for document in documents:

        document_name = (
            document.get(
                "document_name"
            )
            or "Unknown Document"
        )

        content = (
            document.get(
                "content"
            )
            or document.get(
                "text"
            )
            or ""
        )

        if content:

            document_context.append(
                f"""
Document:
{document_name}

Content:
{content}
"""
            )

    prompt = f"""
You are ContentCrew's AI Strategist.

Your job:

1. Analyze the brand profile.
2. Analyze previous conversations.
3. Analyze analytics performance.
4. Analyze uploaded documents.

Generate:

- monthly objectives
- content themes
- recommended channels
- weekly content plans
- campaign ideas

Be practical.

Align recommendations with:

- audience
- goals
- preferred platforms
- previous discussions

Return STRICT JSON only.

No markdown.
No explanations.
No extra text.

JSON FORMAT:

{{
    "monthly_objectives": [],
    "content_themes": [],
    "recommended_channels": [],
    "weekly_plan": [
        {{
            "week": 1,
            "topic": "",
            "channel": ""
        }}
    ],
    "campaign_ideas": []
}}

================================
BRAND PROFILE
================================

{brand_profile}

================================
MEMORY SUMMARY
================================

{memory_summary}

================================
ANALYTICS
================================

{analytics}

================================
DOCUMENTS
================================

{chr(10).join(document_context)}

RETURN JSON ONLY:
"""

    response = generate_text(
        prompt
    )

    strategy = _parse_strategy_payload(
        response
    )

    strategy["content_themes"] = [
        theme["name"]
        if isinstance(theme, dict)
        else str(theme)
        for theme in strategy["content_themes"]
    ]

    strategy["campaign_ideas"] = [
        idea["name"]
        if isinstance(idea, dict)
        else str(idea)
        for idea in strategy["campaign_ideas"]
    ]

    (
        supabase
        .table("strategies")
        .upsert(
            {
                "workspace_id":
                    workspace_id,

                "strategy":
                    strategy,
            },
            on_conflict=
                "workspace_id",
        )
        .execute()
    )

    return strategy