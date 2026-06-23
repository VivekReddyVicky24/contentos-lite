import { Navigate } from "react-router-dom";

import {
  useWorkspace,
} from "@/features/workspace/context/WorkspaceContext";

export default function WorkspaceGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    workspace,
    loading,
  } = useWorkspace();

  if (loading) {
    return (
      <div>
        Loading Workspace...
      </div>
    );
  }

  if (!workspace) {
    return (
      <Navigate
        to="/create-workspace"
        replace
      />
    );
  }

  return <>{children}</>;
}