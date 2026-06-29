import { supabase } from "@/lib/supabase";

import type { Workspace } from "../types/workspace";

export async function createWorkspace(
  name: string,
  slug: string,
  ownerId: string
): Promise<Workspace> {
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
): Promise<Workspace[]> {
  const { data, error } =
    await supabase
      .from("workspaces")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", {
        ascending: true,
      });

  if (error) throw error;

  return data;
}

export async function getWorkspaceById(
  workspaceId: string
): Promise<Workspace> {
  const { data, error } =
    await supabase
      .from("workspaces")
      .select("*")
      .eq("id", workspaceId)
      .single();

  if (error) throw error;

  return data;
}
