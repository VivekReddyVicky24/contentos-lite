import { supabase } from "@/lib/supabase";

export async function uploadDocument(
  file: File,
  workspaceId: string
) {
  const filePath =
    `${workspaceId}/${Date.now()}-${file.name}`;

  const { error: storageError } =
    await supabase.storage
      .from("documents")
      .upload(
        filePath,
        file
      );

  if (storageError) {
    throw storageError;
  }

  const { data, error } =
    await supabase
      .from("documents")
      .insert({
        workspace_id: workspaceId,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: filePath,
      })
      .select()
      .single();

  if (error) {
    throw error;
  }

  return data;
}
export async function getDocuments(
  workspaceId: string
) {
  const { data, error } =
    await supabase
      .from("documents")
      .select("*")
      .eq(
        "workspace_id",
        workspaceId
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteDocument(
  documentId: string,
  storagePath: string
) {
  const { error: storageError } =
    await supabase.storage
      .from("documents")
      .remove([storagePath]);

  if (storageError) {
    throw storageError;
  }

  const { error } =
    await supabase
      .from("documents")
      .delete()
      .eq("id", documentId);

  if (error) {
    throw error;
  }
}
