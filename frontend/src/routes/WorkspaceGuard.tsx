import { Navigate } from "react-router-dom";

import { useWorkspace } from "@/features/workspace/context/WorkspaceContext";

export default function WorkspaceGuard({
  children,
}: {
  children: React.ReactNode;
}) {

  const {
    workspace,
    loading,
  } = useWorkspace();

  // VERY IMPORTANT
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading workspace...
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