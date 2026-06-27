from app.db.supabase import supabase


def log_guardrail_violation(
    workspace_id: str | None,
    violation_type: str,
    input_text: str,
    output_text: str | None = None,
):

    supabase.table(
        "guardrail_logs"
    ).insert(
        {
            "workspace_id": workspace_id,
            "violation_type": violation_type,
            "input_text": input_text,
            "output_text": output_text,
        }
    ).execute()