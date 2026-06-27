import axios from "axios";

import type {
  AgentResponse,
} from "../types/contentStudio";

const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://127.0.0.1:8000";

export async function runPipeline(
  topic: string,
  workspaceId: string,
): Promise<AgentResponse> {

  const response =
    await axios.post(
      `${API_URL}/agents/research`,
      {
        topic,
        workspace_id: workspaceId,
      },
    );

  return response.data;
}