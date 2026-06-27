import axios from "axios";

import type {
  Analytics,
} from "../types/analytics";

const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://127.0.0.1:8000";


export async function getAnalytics(
  workspaceId: string,
): Promise<Analytics> {

  const response =
    await axios.get(
      `${API_URL}/analytics/${workspaceId}`,
    );

  return response.data;
}