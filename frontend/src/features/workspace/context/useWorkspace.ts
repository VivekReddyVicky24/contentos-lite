  import {
    useContext,
  } from "react";

  import {
    WorkspaceContext,
  } from "./workspace-context";

  export const useWorkspace = () =>
    useContext(WorkspaceContext);
