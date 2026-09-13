import axios from "axios";

import type {
  Strategy,
} from "../types/strategy";

const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://127.0.0.1:8000";


export async function getStrategy(
  workspaceId: string,
): Promise<Strategy> {

  const response =
    await axios.get(
      `${API_URL}/strategy/${workspaceId}`,
    );

  return response.data;
}


export async function regenerateStrategy(
  workspaceId: string,
): Promise<Strategy> {

  const response =
    await axios.post(
      `${API_URL}/strategy/${workspaceId}/regenerate`,
    );

  return response.data;
}