from app.services.chunk_service import chunk_text
from app.services.embedding_service import generate_embedding
from app.core.supabase import supabase


def process_document(
    document_id: str,
    workspace_id: str,
    raw_text: str,
):
    try:

        # -------------------------
        # STEP 1: status = chunking
        # -------------------------
        supabase.table("documents").update(
            {
                "processing_status": "chunking"
            }
        ).eq(
            "id",
            document_id
        ).execute()

        chunks = chunk_text(raw_text)

        # -------------------------
        # STEP 2: status = embedding
        # -------------------------
        supabase.table("documents").update(
            {
                "processing_status": "embedding"
            }
        ).eq(
            "id",
            document_id
        ).execute()

        records = []

        for index, chunk in enumerate(chunks):

            embedding = generate_embedding(chunk)

            records.append(
                {
                    "document_id": document_id,
                    "workspace_id": workspace_id,
                    "chunk_index": index,
                    "content": chunk,
                    "embedding": embedding,
                    "metadata": {
                        "chunk_index": index
                    }
                }
            )

        # -------------------------
        # STEP 3: save chunks
        # -------------------------
        supabase.table(
            "document_chunks"
        ).insert(
            records
        ).execute()

        # -------------------------
        # STEP 4: update document
        # -------------------------
        supabase.table("documents").update(
            {
                "chunk_count": len(chunks),
                "processing_status": "ready",
            }
        ).eq(
            "id",
            document_id
        ).execute()

        return {
            "status": "success",
            "chunks": len(chunks),
        }

    except Exception as e:

        supabase.table("documents").update(
            {
                "processing_status": "failed"
            }
        ).eq(
            "id",
            document_id
        ).execute()

        raise e