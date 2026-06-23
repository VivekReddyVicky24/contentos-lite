import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "@/features/auth/context/AuthContext";
import { getWorkspaces } from "../services/workspaceService";

interface Workspace {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
}

interface WorkspaceContextType {
  workspace: Workspace | null;
  loading: boolean;
  refreshWorkspace: () => Promise<void>;
}

const WorkspaceContext =
  createContext<WorkspaceContextType>({
    workspace: null,
    loading: true,
    refreshWorkspace: async () => {},
  });

export function WorkspaceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  const [workspace, setWorkspace] =
    useState<Workspace | null>(null);

  const [loading, setLoading] =
    useState(true);

  async function refreshWorkspace() {
    if (!user) {
      setWorkspace(null);
      setLoading(false);
      return;
    }

    const workspaces =
      await getWorkspaces(user.id);

    if (
      workspaces &&
      workspaces.length > 0
    ) {
      setWorkspace(workspaces[0]);
    }

    setLoading(false);
  }

  useEffect(() => {
    refreshWorkspace();
  }, [user]);

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