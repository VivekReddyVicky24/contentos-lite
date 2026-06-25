from app.services.search_service import (
    semantic_search,
)

from app.services.llm_service import (
    generate_grounded_response,
)

from app.core.supabase import supabase


def ask_brand_brain(
    question: str,
    workspace_id: str,
):
    chunks = semantic_search(
        question,
        workspace_id,
    )

    if not chunks:
        return {
            "answer":
                "No relevant documents found.",
            "sources": [],
            "confidence": 0,
        }

    context = "\n\n".join(
        chunk["content"]
        for chunk in chunks
    )

    answer = generate_grounded_response(
        question,
        context,
    )

    if (
        "I could not find"
        in answer
    ):
        confidence = 0
    elif len(chunks) >= 5:
        confidence = 95
    elif len(chunks) >= 3:
        confidence = 80
    else:
        confidence = 60

    unique_sources = list(
        {
            chunk["document_name"]
            for chunk in chunks
        }
    )

    return {
        "answer": answer,
        "sources": unique_sources,
        "confidence": confidence,
    }