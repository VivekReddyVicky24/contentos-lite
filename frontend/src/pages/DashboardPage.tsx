import { Link } from "react-router-dom";
import LogoutButton from "@/components/LogoutButton";

import {
  useWorkspace,
} from "@/features/workspace/context/WorkspaceContext";

export default function DashboardPage() {
  const { workspace } =
    useWorkspace();

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            {workspace?.name}
          </h1>

          <p className="text-muted-foreground">
            {workspace?.slug}
          </p>
        </div>

        <LogoutButton />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded p-4">
          <h2>Members</h2>

          <p>1</p>
        </div>

        <div className="border rounded p-4">
          <h2>Documents</h2>

          <p>0</p>

          <Link to="/documents">Documents</Link>
        </div>

        <div className="border rounded p-4">
          <h2>Content Generated</h2>

          <p>0</p>

          <Link to="/brand-brain">
            Brand Brain
          </Link>
        </div>
      </div>
    </div>
  );
}