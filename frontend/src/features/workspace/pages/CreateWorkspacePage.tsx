import {
  ArrowRight,
  Building2,
} from "lucide-react";
import { useState } from "react";
import {
  Navigate,
  useNavigate,
} from "react-router-dom";
import { toast } from "sonner";

import {
  Button,
} from "@/components/ui/button";
import {
  Card,
} from "@/components/ui/card";
import {
  Input,
} from "@/components/ui/input";
import {
  Label,
} from "@/components/ui/label";

import {
  useAuth,
} from "@/features/auth/context/useAuth";

import {
  createWorkspace,
} from "../services/workspaceService";

import {
  useWorkspace,
} from "../context";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

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

  async function handleCreate(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    const trimmedName =
      name.trim();

    if (!user || !trimmedName) {
      return;
    }

    try {
      setLoading(true);

      const createdWorkspace =
        await createWorkspace(
          trimmedName,
          slugify(trimmedName),
          user.id
        );

      setWorkspace(
        createdWorkspace,
      );

      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(
        "Workspace creation failed.",
      );
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
      <div className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-500">
        Loading workspace...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 p-6">
        <Card className="max-w-md p-6 text-left">
          <h1 className="text-2xl font-bold text-slate-950">
            Workspace unavailable
          </h1>

          <p className="mt-2 text-slate-500">
            {error?.message ??
              "Unable to load your workspace."}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <Card className="w-full max-w-lg p-6 text-left">
        <div className="grid size-12 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
          <Building2 className="size-6" />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Workspace setup
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Create Workspace
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            This workspace stores brand profiles, documents, evaluations, publications, and analytics.
          </p>
        </div>

        <form
          onSubmit={handleCreate}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>
              Workspace Name
            </Label>

            <Input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="AI Fitness Lab"
              required
            />
          </div>

          <div className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-500">
            Slug:{" "}
            <span className="font-medium text-slate-800">
              {slugify(name) || "workspace-slug"}
            </span>
          </div>

          <Button
            className="w-full"
            disabled={
              loading ||
              !name.trim()
            }
          >
            {loading
              ? "Creating..."
              : "Create Workspace"}
            <ArrowRight className="size-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
