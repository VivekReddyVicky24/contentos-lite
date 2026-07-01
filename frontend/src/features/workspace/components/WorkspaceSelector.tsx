import { useWorkspace } from "@/features/workspace/context";

export default function WorkspaceSelector() {
  const { workspace } = useWorkspace();

  if (!workspace) {
    return null;
  }

  return (
    <div className="truncate text-sm text-slate-500">
      Workspace:{" "}
      <span className="font-semibold">
        {workspace.name}
      </span>
    </div>
  );
}
