import { supabase } from "@/lib/supabase";

export async function createWorkspace(
  name: string,
  slug: string,
  ownerId: string
) {
  const { data, error } =
    await supabase
      .from("workspaces")
      .insert({
        name,
        slug,
        owner_id: ownerId,
      })
      .select()
      .single();

  if (error) throw error;

  return data;
}

export async function getWorkspaces(
  userId: string
) {
  const { data, error } =
    await supabase
      .from("workspaces")
      .select("*")
      .eq("owner_id", userId);

  if (error) throw error;

  return data;
}