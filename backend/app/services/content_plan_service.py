import json
import re
from datetime import datetime

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


DEFAULT_PLAN = {
    "month": "",
    "weeks": [],
}


def _extract_json(
    raw_response: str,
):
    """
    Extract a JSON object from an LLM response.

    Handles:
    - plain JSON
    - ```json ... ```
    - ``` ... ```
    - extra text surrounding JSON
    """

    if not raw_response:
        return None

    cleaned = raw_response.strip()

    # Remove markdown code fences.
    cleaned = re.sub(
        r"^```(?:json)?\s*",
        "",
        cleaned,
        flags=re.IGNORECASE,
    )

    cleaned = re.sub(
        r"\s*```$",
        "",
        cleaned,
    )

    cleaned = cleaned.strip()

    # First attempt: complete response is JSON.
    try:
        return json.loads(cleaned)

    except json.JSONDecodeError:
        pass

    # Second attempt: find the JSON object inside
    # surrounding text.
    start = cleaned.find("{")
    end = cleaned.rfind("}")

    if start == -1 or end == -1 or start >= end:
        return None

    json_text = cleaned[start : end + 1]

    try:
        return json.loads(json_text)

    except json.JSONDecodeError:
        return None


def _normalize_weekly_plan(
    weeks,
):
    """
    Normalize weekly plan data so the frontend
    always receives predictable objects.
    """

    if not isinstance(weeks, list):
        return []

    normalized_weeks = []

    for index, week in enumerate(weeks):

        if not isinstance(week, dict):
            continue

        raw_week_number = week.get(
            "week",
            index + 1,
        )

        try:
            week_number = int(
                raw_week_number
            )
        except (TypeError, ValueError):
            week_number = index + 1

        posts = week.get(
            "posts",
            [],
        )

        if not isinstance(posts, list):
            posts = []

        normalized_posts = []

        for post in posts:

            if not isinstance(post, dict):
                continue

            platform = str(
                post.get(
                    "platform",
                    "",
                )
                or ""
            ).strip()

            title = str(
                post.get(
                    "title",
                    "",
                )
                or ""
            ).strip()

            content_type = str(
                post.get(
                    "type",
                    "",
                )
                or ""
            ).strip()

            normalized_posts.append(
                {
                    "platform": platform,
                    "title": title,
                    "type": content_type,
                }
            )

        normalized_weeks.append(
            {
                "week": week_number,
                "posts": normalized_posts,
            }
        )

    return normalized_weeks


def _parse_plan(
    raw_response: str,
):
    """
    Safely parse and normalize the planner LLM output.
    """

    parsed = _extract_json(
        raw_response
    )

    if not isinstance(parsed, dict):
        return dict(DEFAULT_PLAN)

    month = str(
        parsed.get(
            "month",
            "",
        )
        or ""
    ).strip()

    weeks = _normalize_weekly_plan(
        parsed.get(
            "weeks",
            [],
        )
    )

    return {
        "month": month,
        "weeks": weeks,
    }


def _get_current_month():
    """
    Return the current month in a readable format.
    Example: September 2026
    """

    return datetime.now().strftime(
        "%B %Y"
    )


def generate_monthly_plan(
    workspace_id: str,
):
    """
    Generate and persist a monthly content plan
    using brand information, memory, analytics,
    and relevant RAG documents.
    """

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
            "content calendar",
            workspace_id,
        )
        or []
    )

    document_context = []

    for document in documents:

        if not isinstance(
            document,
            dict,
        ):
            continue

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

        if not content:
            continue

        document_context.append(
            f"""
Document:
{document_name}

Content:
{content}
"""
        )

    current_month = (
        _get_current_month()
    )

    prompt = f"""
You are ContentCrew's AI Content Planner.

Create a practical monthly content calendar
for the workspace.

The current month is:

{current_month}

Use all available information:

1. Brand profile
2. Brand memory
3. Historical analytics
4. Relevant uploaded documents

The plan must align with:

- brand voice
- target audience
- business goals
- preferred channels
- previous content decisions
- analytics performance

Create a realistic plan for the current month.

Return STRICT JSON only.

Do not return markdown.

Do not return explanations.

Do not return commentary.

Do not wrap the response in code fences.

The JSON must have exactly this structure:

{{
    "month": "{current_month}",
    "weeks": [
        {{
            "week": 1,
            "posts": [
                {{
                    "platform": "LinkedIn",
                    "title": "Example title",
                    "type": "Post"
                }}
            ]
        }}
    ]
}}

Rules:

- Create 4 weeks.
- Each week should contain practical content ideas.
- Use only channels supported by the brand profile when available.
- Do not invent unsupported brand facts.
- Make topics specific and actionable.
- Use analytics to favor stronger-performing content patterns.
- Keep the number of posts realistic.
- Every post must have a platform, title, and type.

================================
BRAND PROFILE
================================

{json.dumps(
    brand_profile,
    indent=2,
    default=str,
)}

================================
MEMORY SUMMARY
================================

{memory_summary or "No memory available."}

================================
ANALYTICS
================================

{json.dumps(
    analytics,
    indent=2,
    default=str,
)}

================================
RELEVANT DOCUMENTS
================================

{
    chr(10).join(
        document_context
    )
    if document_context
    else "No relevant documents found."
}

================================
RETURN JSON ONLY
================================
"""

    raw_response = generate_text(
        prompt
    )

    plan = _parse_plan(
        raw_response
    )

    # Ensure the database receives a valid month.
    if not plan["month"]:
        plan["month"] = current_month

    payload = {
        "workspace_id": workspace_id,
        "plan": plan,
        "month": plan["month"],
    }

    (
        supabase
        .table("content_plans")
        .upsert(
            payload,
            on_conflict="workspace_id",
        )
        .execute()
    )

    return plan