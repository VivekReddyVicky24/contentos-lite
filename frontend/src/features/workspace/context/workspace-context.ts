import {
  createContext,
} from "react";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
}

export interface WorkspaceContextType {
  workspace: Workspace | null;
  loading: boolean;
  refreshWorkspace: () => Promise<void>;
}

export const WorkspaceContext =
  createContext<WorkspaceContextType>({
    workspace: null,
    loading: true,
    refreshWorkspace: async () => {},
  });
