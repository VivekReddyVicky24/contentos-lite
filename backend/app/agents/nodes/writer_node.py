import json
import os

from dotenv import load_dotenv

from langchain_google_genai import (
    ChatGoogleGenerativeAI,
)

from app.agents.prompts.writer_prompt import (
    WRITER_PROMPT,
)

from app.agents.prompts.brand_context import (
    build_brand_context,
)

load_dotenv()


llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash-lite",
    google_api_key=os.getenv(
        "GEMINI_API_KEY"
    ),
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

    response = llm.invoke(prompt)

    try:

        cleaned = (
            response.content
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        draft = json.loads(cleaned)

    except Exception as e:

        print("WRITER ERROR:", e)
        print(response.content)

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
    