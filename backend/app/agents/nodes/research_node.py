from app.agents.prompts.brand_context import (
    build_brand_context,
)
from app.services.llm_service import (
    generate_text,
)


def research_node(
    state,
):
    brand_context = build_brand_context(
        state.get(
            "brand_profile",
            {},
        )
    )

    prompt = f"""
{brand_context}

Research this topic:

{state['topic']}
"""

    response = generate_text(
        prompt
    )

    return {
        "research": response,
        "current_agent": "research",
        "execution_log": [
            "research: completed"
        ],
    }
