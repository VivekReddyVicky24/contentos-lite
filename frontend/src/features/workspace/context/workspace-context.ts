import { createContext } from "react";

import type { Workspace } from "../types/workspace";

export type WorkspaceStatus =
  | "auth-loading"
  | "workspace-loading"
  | "ready"
  | "empty"
  | "error";

export interface WorkspaceContextType {
  workspace: Workspace | null;
  status: WorkspaceStatus;
  loading: boolean;
  error: Error | null;
  setWorkspace: (workspace: Workspace | null) => void;
  refreshWorkspace: () => Promise<void>;
}

export const WorkspaceContext =
  createContext<WorkspaceContextType | undefined>(
    undefined,
  );
