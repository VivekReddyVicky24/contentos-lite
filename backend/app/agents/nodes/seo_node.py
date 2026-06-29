import json

from app.agents.prompts.seo_prompt import (
    SEO_PROMPT,
)
from app.agents.prompts.brand_context import (
    build_brand_context,
)
from app.services.llm_service import (
    generate_text,
)


def seo_node(state):

    brand_context = build_brand_context(
        state.get(
            "brand_profile",
            {},
        )
    )

    prompt = f"""
{brand_context}

{SEO_PROMPT.format(
    topic=state["topic"],
    research=state["research"],
    plan=json.dumps(
        state["plan"],
        indent=2,
    ),
)}
"""

    response = generate_text(prompt)

    try:

        cleaned = (
            response
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        seo = json.loads(cleaned)

    except Exception as e:

        print("SEO ERROR:", e)

        print(response)

        seo = {
            "primary_keyword": "",
            "secondary_keywords": [],
            "search_intent": "",
            "meta_title": "",
            "meta_description": "",
            "internal_link_ideas": [],
        }

    logs = state.get(
        "execution_log",
        []
    )

    logs.append(
        "seo: completed"
    )

    return {
        "seo": seo,
        "current_agent": "seo",
        "execution_log": logs,
    }
