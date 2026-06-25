from app.services.search_service import (
    semantic_search,
)

from app.services.llm_service import (
    generate_grounded_response,
)


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

    return {
        "answer": answer,
        "sources": [
            chunk["document_id"]
            for chunk in chunks
        ],
        "confidence": min(
            100,
            len(chunks) * 20,
        ),
    }