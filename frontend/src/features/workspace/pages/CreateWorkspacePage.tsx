import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  useAuth,
} from "@/features/auth/context/useAuth";

import {
  createWorkspace,
} from "../services/workspaceService";

import {
  useWorkspace,
} from "../context/useWorkspace";

export default function CreateWorkspacePage() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const {
    refreshWorkspace,
  } = useWorkspace();

  const [name, setName] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleCreate() {
    if (!user) return;

    try {
      setLoading(true);

      const slug = name
        .toLowerCase()
        .replace(/\s+/g, "-");

      await createWorkspace(
        name,
        slug,
        user.id
      );

      await refreshWorkspace();

      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">
          Create Workspace
        </h1>

        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="Workspace Name"
          className="border p-2"
        />

        <button
          onClick={handleCreate}
        >
          {loading
            ? "Creating..."
            : "Create"}
        </button>
      </div>
    </div>
  );
}
