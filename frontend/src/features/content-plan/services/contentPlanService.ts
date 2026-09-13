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


export async function regenerateMonthlyPlan(
  workspaceId: string,
): Promise<ContentPlan> {
  const response =
    await axios.post<ContentPlan>(
      `${API_URL}/content-plan/${workspaceId}/regenerate`,
    );

  return response.data;
}


export async function addContentItem(
  workspaceId: string,
  title: string,
  topic: string,
  channel: string,
) {
  const response =
    await axios.post(
      `${API_URL}/content-items/${workspaceId}`,
      null,
      {
        params: {
          title,
          topic,
          channel,
        },
      },
    );

  return response.data;
}


export async function getContentItems(
  workspaceId: string,
) {
  const response =
    await axios.get(
      `${API_URL}/content-items/${workspaceId}`,
    );

  return response.data;
}