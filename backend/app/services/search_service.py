from app.core.supabase import supabase

from app.services.embedding_service import (
    generate_embedding,
)


def semantic_search(
    query: str,
    workspace_id: str,
):
    embedding = generate_embedding(query)

    result = (
        supabase
        .rpc(
            "match_document_chunks",
            {
                "query_embedding": embedding,
                "match_workspace_id": workspace_id,
                "match_count": 5,
            },
        )
        .execute()
    )

    return result.data