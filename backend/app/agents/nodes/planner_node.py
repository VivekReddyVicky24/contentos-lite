import json

from app.agents.prompts.planner_prompt import (
    PLANNER_PROMPT,
)
from app.agents.prompts.brand_context import (
    build_brand_context,
)
from app.services.llm_service import (
    generate_text,
)


def planner_node(state):

    brand_context = build_brand_context(
        state.get(
            "brand_profile",
            {},
        )
    )

    prompt = f"""
    {brand_context}

    {PLANNER_PROMPT.format(
        research=state["research"]
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

        plan = json.loads(cleaned)

    except Exception as e:

        print("PLANNER ERROR:", e)
        print("RAW RESPONSE:")
        print(response)

        plan = {
            "target_audience": [],
            "content_angles": [],
            "blog_titles": [],
            "content_goal":
                "Could not generate plan",
        }
    
    logs = state.get(
        "execution_log",
        []
    )

    logs.append(
        "planner: completed"
    )
    
    return {
    "plan": plan,

    "current_agent":
        "planner",

    "execution_log":
        logs,
}
