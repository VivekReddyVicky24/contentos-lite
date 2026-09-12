import axios from "axios";

import type {
  ContentPlan,
} from "../types/contentPlan";


const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://127.0.0.1:8000";


export async function getMonthlyPlan(
  workspaceId: string,
): Promise<ContentPlan> {

  const response =
    await axios.get<ContentPlan>(
      `${API_URL}/content-plan/${workspaceId}`,
    );

  return response.data;
}