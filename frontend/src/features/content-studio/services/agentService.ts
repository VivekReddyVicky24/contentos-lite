import axios from "axios";

import type {
  AgentResponse,
} from "../types/contentStudio";

const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://127.0.0.1:8000";

export async function runPipeline(
  topic: string,
): Promise<AgentResponse> {

  const response =
    await axios.post(
      `${API_URL}/agents/research`,
      {
        topic,
      },
    );

  return response.data;
}