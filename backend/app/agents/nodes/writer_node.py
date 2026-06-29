import json

from app.agents.prompts.writer_prompt import (
    WRITER_PROMPT,
)

from app.agents.prompts.brand_context import (
    build_brand_context,
)
from app.services.llm_service import (
    generate_text,
)


def writer_node(state):

    brand_context = build_brand_context(
        state.get(
            "brand_profile",
            {},
        )
    )

    prompt = f"""
{brand_context}

{WRITER_PROMPT.format(
    topic=state["topic"],
    research=state["research"],
    plan=json.dumps(
        state["plan"],
        indent=2,
    ),
    seo=json.dumps(
        state["seo"],
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

        draft = json.loads(cleaned)

    except Exception as e:

        print("WRITER ERROR:", e)
        print(response)

        draft = {
            "title": "",
            "introduction": "",
            "sections": [],
            "conclusion": "",
            "call_to_action": "",
        }

    logs = state.get(
        "execution_log",
        []
    )

    logs.append(
        "writer: completed"
    )

    return {
        "draft": draft,
        "current_agent": "writer",
        "execution_log": logs,
    }


# TODO:
# Add brand voice memory
# Add workspace-specific tone
# Add citation tracking
# Add groundedness verification
    
