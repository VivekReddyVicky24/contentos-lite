import { useWorkspace } from "@/features/workspace/context";

export default function WorkspaceSelector() {
  const { workspace } = useWorkspace();

  if (!workspace) {
    return null;
  }

  return (
    <div className="rounded-lg border px-4 py-2">
      Current Workspace:{" "}
      <span className="font-semibold">
        {workspace.name}
      </span>
    </div>
  );
}
