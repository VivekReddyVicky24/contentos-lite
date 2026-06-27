import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "@/features/auth/context/useAuth";
import { getWorkspaces } from "../services/workspaceService";
import {
  WorkspaceContext,
} from "./workspace-context";
import type {
  Workspace,
} from "./workspace-context";

export function WorkspaceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [workspace, setWorkspace] =
    useState<Workspace | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [loadedUserId, setLoadedUserId] =
    useState<string | null>(null);

  const loadWorkspace =
    useCallback(async (showLoading: boolean) => {
      if (!userId) {
        setWorkspace(null);
        setLoadedUserId(null);
        setLoading(false);
        return;
      }

      if (showLoading) {
        setLoading(true);
      }

      try {
        const workspaces =
          await getWorkspaces(userId);

        if (
          workspaces &&
          workspaces.length > 0
        ) {
          setWorkspace(workspaces[0]);
        } else {
          setWorkspace(null);
        }
      } catch (error) {
        console.error(error);
        setWorkspace(null);
      } finally {
        setLoadedUserId(userId);
        setLoading(false);
      }
    }, [userId]);

  const refreshWorkspace =
    useCallback(async () => {
      await loadWorkspace(
        loadedUserId !== userId
      );
    }, [
      loadedUserId,
      loadWorkspace,
      userId,
    ]);

  useEffect(() => {

  if (!userId) {
    setWorkspace(null);
    setLoading(false);
    return;
  }

  void loadWorkspace(true);

}, [userId, loadWorkspace]);
console.log("USER:", userId);
console.log("WORKSPACE:", workspace);
console.log("LOADING:", loading);
  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        loading,
        refreshWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
export const useWorkspace = () =>
  useContext(WorkspaceContext);