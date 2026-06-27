import json
import os

from dotenv import load_dotenv

from langchain_google_genai import (
    ChatGoogleGenerativeAI,
)

from app.agents.prompts.brand_context import (
    build_brand_context,
)
from app.agents.prompts.editor_prompt import (
    EDITOR_PROMPT,
)
from app.evaluation.evaluator import (
    evaluate_content,
)
from app.guardrails.output_validator import (
    validate_output,
)
from app.services.evaluation_service import (
    save_evaluation,
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
                "Editing failed",
            ],
        }

    logs = state.get(
        "execution_log",
        []
    )

    logs.append(
        "editor: completed"
    )

    workspace_id = (
        state.get(
            "brand_profile",
            {},
        ).get(
            "workspace_id"
        )
    )

    output_text = str(edited)

    valid, error = validate_output(
        output_text,
        workspace_id,
    )

    if not valid:

        logs.append(
            f"editor validation failed: {error}"
        )

        return {
            "edited_draft": {},
            "evaluation": {},
            "failed": True,
            "error_message": error,
            "current_agent": "editor",
            "execution_log": logs,
        }

    logs.append(
        "editor validation passed"
    )

    evaluation = evaluate_content(
        edited,
        state["research"],
        state.get(
            "brand_profile",
            {},
        ),
    )

    if workspace_id:

        save_evaluation(
            workspace_id,
            evaluation,
        )

    logs.append(
        "evaluation completed"
    )

    return {
        "edited_draft": edited,
        "evaluation": evaluation,
        "failed": False,
        "error_message": "",
        "current_agent": "editor",
        "execution_log": logs,
    }