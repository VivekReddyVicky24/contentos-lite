import json

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
from app.services.llm_service import (
    generate_text,
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

    response = generate_text(prompt)

    try:

        cleaned = (
            response
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        edited = json.loads(cleaned)

    except Exception as e:

        print("EDITOR ERROR:", e)
        print(response)

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
