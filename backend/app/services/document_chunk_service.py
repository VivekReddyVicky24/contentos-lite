from app.core.supabase import supabase


def save_chunks(
    document_id: str,
    workspace_id: str,
    chunks: list[str],
):
    records = []

    for index, chunk in enumerate(chunks):
        records.append(
            {
                "document_id": document_id,
                "workspace_id": workspace_id,
                "chunk_index": index,
                "content": chunk,
            }
        )

    result = (
        supabase
        .table("document_chunks")
        .insert(records)
        .execute()
    )

    return result