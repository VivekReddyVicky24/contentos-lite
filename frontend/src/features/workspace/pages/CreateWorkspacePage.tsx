import { useState } from "react";

export default function CreateWorkspacePage() {
  const [name, setName] = useState("");

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Create Workspace
      </h1>

      <input
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />
    </div>
  );
}