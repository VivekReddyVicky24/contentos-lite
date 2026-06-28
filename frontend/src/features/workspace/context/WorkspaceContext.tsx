import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

import { useAuth } from "@/features/auth/context/useAuth";
import { getWorkspaces } from "../services/workspaceService";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
}

interface WorkspaceContextType {
  workspace: Workspace | null;
  loading: boolean;
  refreshWorkspace: () => Promise<void>;
  setWorkspace: (
    workspace: Workspace | null,
  ) => void;
}

const WorkspaceContext =
  createContext<WorkspaceContextType>({
    workspace: null,
    loading: true,
    refreshWorkspace: async () => {},
    setWorkspace: () => {},
  });

const STORAGE_KEY =
  "contentcrew:selected-workspace";

export function WorkspaceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();

  const [workspace, setWorkspaceState] =
    useState<Workspace | null>(null);

  const [loading, setLoading] =
    useState(true);

  const setWorkspace = (
    value: Workspace | null,
  ) => {
    setWorkspaceState(value);

    if (value) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(value),
      );
    } else {
      localStorage.removeItem(
        STORAGE_KEY,
      );
    }
  };

  const loadWorkspace =
    useCallback(async () => {
      if (!user?.id) {
        setWorkspace(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const workspaces =
          await getWorkspaces(
            user.id,
          );

        if (
          !workspaces ||
          workspaces.length === 0
        ) {
          setWorkspace(null);
          return;
        }

        const savedWorkspace =
          localStorage.getItem(
            STORAGE_KEY,
          );

        if (savedWorkspace) {
          const parsed =
            JSON.parse(
              savedWorkspace,
            );

          const existing =
            workspaces.find(
              (w) =>
                w.id === parsed.id,
            );

          if (existing) {
            setWorkspace(existing);
            return;
          }
        }

        setWorkspace(
          workspaces[0],
        );
      } catch (error) {
        console.error(
          "Workspace load failed:",
          error,
        );

        setWorkspace(null);
      } finally {
        setLoading(false);
      }
    }, [user]);

  const refreshWorkspace =
    useCallback(async () => {
      await loadWorkspace();
    }, [loadWorkspace]);

  useEffect(() => {
    void loadWorkspace();
  }, [loadWorkspace]);

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        loading,
        refreshWorkspace,
        setWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export const useWorkspace = () =>
  useContext(
    WorkspaceContext,
  );