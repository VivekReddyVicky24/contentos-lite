import { useState } from "react";
import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "@/features/auth/context/useAuth";

import {
  createWorkspace,
} from "../services/workspaceService";

import {
  useWorkspace,
} from "../context";

export default function CreateWorkspacePage() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const {
    loading: workspaceLoading,
    status,
    error,
    setWorkspace,
  } = useWorkspace();

  const [name, setName] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleCreate() {
    const trimmedName =
      name.trim();

    if (!user || !trimmedName) {
      return;
    }

    try {
      setLoading(true);

      const slug = trimmedName
        .toLowerCase()
        .replace(/\s+/g, "-");

      const createdWorkspace =
        await createWorkspace(
        trimmedName,
        slug,
        user.id
      );

      setWorkspace(
        createdWorkspace,
      );

      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (status === "ready") {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  if (workspaceLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading workspace...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
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
