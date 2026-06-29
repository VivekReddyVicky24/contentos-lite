import { Navigate } from "react-router-dom";

import { useWorkspace } from
  "@/features/workspace/context";

export default function WorkspaceGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    loading,
    status,
    error,
  } = useWorkspace();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading workspace...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md space-y-2">
          <h1 className="text-2xl font-bold">
            Workspace unavailable
          </h1>

          <p className="text-muted-foreground">
            {error?.message ??
              "Unable to load your workspace."}
          </p>
        </div>
      </div>
    );
  }

  if (status === "empty") {
    return (
      <Navigate
        to="/create-workspace"
        replace
      />
    );
  }

  if (status !== "ready") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading workspace...
      </div>
    );
  }

  return <>{children}</>;
}
