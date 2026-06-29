import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { ReactNode } from "react";

import { useAuth } from "@/features/auth/context/useAuth";

import { getWorkspaces } from "../services/workspaceService";
import type { Workspace } from "../types/workspace";
import {
  WorkspaceContext,
  type WorkspaceStatus,
} from "./workspace-context";

const OLD_STORAGE_KEY =
  "contentcrew:selected-workspace";

const STORAGE_KEY =
  "contentcrew:selected-workspace-id";

function readPersistedWorkspaceId() {
  const existingId =
    localStorage.getItem(STORAGE_KEY);

  if (existingId) {
    return existingId;
  }

  const oldWorkspace =
    localStorage.getItem(OLD_STORAGE_KEY);

  if (!oldWorkspace) {
    return null;
  }

  try {
    const parsed =
      JSON.parse(oldWorkspace) as {
        id?: unknown;
      };

    if (typeof parsed.id === "string") {
      localStorage.setItem(
        STORAGE_KEY,
        parsed.id,
      );

      return parsed.id;
    }
  } catch {
    // Invalid legacy state cannot be trusted.
  } finally {
    localStorage.removeItem(
      OLD_STORAGE_KEY,
    );
  }

  return null;
}

function persistWorkspaceId(
  workspace: Workspace | null,
) {
  if (workspace) {
    localStorage.setItem(
      STORAGE_KEY,
      workspace.id,
    );
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}

export function WorkspaceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading: authLoading } =
    useAuth();

  const [workspace, setWorkspaceState] =
    useState<Workspace | null>(null);

  const [status, setStatus] =
    useState<WorkspaceStatus>(
      "auth-loading",
    );

  const [error, setError] =
    useState<Error | null>(null);

  const loadRequestId =
    useRef(0);

  const setWorkspace =
    useCallback(
      (value: Workspace | null) => {
        setWorkspaceState(value);
        persistWorkspaceId(value);
        setError(null);
        setStatus(
          value ? "ready" : "empty",
        );
      },
      [],
    );

  const loadWorkspace =
    useCallback(async () => {
      const requestId =
        loadRequestId.current + 1;

      loadRequestId.current =
        requestId;

      if (authLoading) {
        setWorkspaceState(null);
        setError(null);
        setStatus("auth-loading");
        return;
      }

      if (!user) {
        setWorkspaceState(null);
        setError(null);
        setStatus("auth-loading");
        return;
      }

      setStatus((currentStatus) =>
        currentStatus === "ready"
          ? currentStatus
          : "workspace-loading",
      );
      setError(null);

      try {
        const workspaces =
          await getWorkspaces(user.id);

        if (
          requestId !==
          loadRequestId.current
        ) {
          return;
        }

        if (workspaces.length === 0) {
          setWorkspaceState(null);
          persistWorkspaceId(null);
          setStatus("empty");
          return;
        }

        const persistedId =
          readPersistedWorkspaceId();

        const selectedWorkspace =
          workspaces.find(
            (item) =>
              item.id === persistedId,
          ) ?? workspaces[0];

        setWorkspaceState(
          selectedWorkspace,
        );
        persistWorkspaceId(
          selectedWorkspace,
        );
        setStatus("ready");
      } catch (caughtError) {
        if (
          requestId !==
          loadRequestId.current
        ) {
          return;
        }

        const nextError =
          caughtError instanceof Error
            ? caughtError
            : new Error(
                "Failed to load workspaces.",
              );

        setError(nextError);
        setStatus("error");
      }
    }, [authLoading, user]);

  const refreshWorkspace =
    useCallback(async () => {
      await loadWorkspace();
    }, [loadWorkspace]);

  useEffect(() => {
    void Promise.resolve().then(
      loadWorkspace,
    );
  }, [loadWorkspace]);

  const value =
    useMemo(
      () => ({
        workspace,
        status,
        loading:
          status === "auth-loading" ||
          status ===
            "workspace-loading",
        error,
        setWorkspace,
        refreshWorkspace,
      }),
      [
        workspace,
        status,
        error,
        setWorkspace,
        refreshWorkspace,
      ],
    );

  return (
    <WorkspaceContext.Provider
      value={value}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
