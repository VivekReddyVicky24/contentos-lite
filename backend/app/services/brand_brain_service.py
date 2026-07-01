from typing import Any

from app.services.brand_service import get_brand_profile
from app.services.conversation_service import (
    get_conversation_history,
    save_message,
)
from app.services.llm_service import generate_text
from app.services.search_service import semantic_search

from app.services.memory_service import (
    get_memory_summary,
    update_memory_summary,
)



def answer_brand_question(workspace_id: str, question: str) -> dict[str, Any]:
    brand_profile = get_brand_profile(workspace_id) or {}
    conversation_history = get_conversation_history(workspace_id, limit=10)
    memory_summary = get_memory_summary(workspace_id)
    retrieved_chunks = semantic_search(question, workspace_id)

    source_names = ["brand_profile"]
    document_context_parts = []

    for chunk in retrieved_chunks:
        document_name = chunk.get("document_name") or "Unknown Document"
        if document_name not in source_names:
            source_names.append(document_name)
        document_context_parts.append(
            f"Document: {document_name}\nContent: {chunk.get('content', '')}"
        )

    brand_profile_text = ""
    if brand_profile:
        brand_profile_text = "\n".join(
            f"{key}: {value}"
            for key, value in brand_profile.items()
            if value is not None
        )

    conversation_lines = []
    for message in conversation_history:
        role = message.get("role", "unknown")
        content = message.get("message", "")
        conversation_lines.append(f"{role}: {content}")

    context_parts = [
    "BRAND PROFILE",

    brand_profile_text
    or "No brand profile available.",

    "",

    "MEMORY SUMMARY",

    memory_summary
    or "No memory available yet.",

    "",

    "CONVERSATION HISTORY",

    "\n".join(
        conversation_lines
    )
    if conversation_lines
    else "No prior conversation.",

    "",

    "DOCUMENT CONTEXT",

    "\n\n".join(
        document_context_parts
    )
    if document_context_parts
    else "No relevant documents found.",
]
    context = "\n".join(context_parts)

    prompt = f"""
You are ContentCrew's Brand Brain.

You have access to:

1. Brand profile
2. Conversation history
3. Uploaded documents

Priority order:

1. Brand profile
2. Documents
3. Conversation history

Never invent facts.

If information is missing,
say so clearly.

Use bullet points when helpful.

Mention source documents when possible.

========================
{context}
========================

USER QUESTION:

{question}

ANSWER:
"""

    answer = generate_text(prompt)

    save_message(workspace_id, "user", question)
    save_message(workspace_id, "assistant", answer)
    update_memory_summary(workspace_id)

    if document_context_parts:
        confidence = 90
    elif brand_profile_text:
        confidence = 70
    else:
        confidence = 50

    return {
        "answer": answer,
        "confidence": confidence,
        "sources": source_names,
    }


def ask_brand_brain(
    question: str,
    workspace_id: str,
):
    return answer_brand_question(
        workspace_id,
        question,
    )
