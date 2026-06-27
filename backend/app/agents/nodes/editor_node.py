import json
import os

from dotenv import load_dotenv

from langchain_google_genai import (
    ChatGoogleGenerativeAI,
)

from app.agents.prompts.editor_prompt import (
    EDITOR_PROMPT,
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


def editor_node(state):

    brand_context = build_brand_context(
        state.get(
            "brand_profile",
            {},
        )
    )

    prompt = f"""
{brand_context}

{EDITOR_PROMPT.format(
    draft=json.dumps(
        state["draft"],
        indent=2,
    )
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

        edited = json.loads(cleaned)

    except Exception as e:

        print("EDITOR ERROR:", e)
        print(response.content)

        edited = {
            "title": "",
            "introduction": "",
            "sections": [],
            "conclusion": "",
            "call_to_action": "",
            "editor_notes": [
                "Editing failed"
            ],
        }

    logs = state.get(
        "execution_log",
        []
    )

    logs.append(
        "editor: completed"
    )

    return {
        "edited_draft": edited,
        "current_agent": "editor",
        "execution_log": logs,
    }


# TODO:
# Add brand voice constraints
# Add groundedness checks
# Add hallucination detection
# Add readability scoring
# Add citation preservation