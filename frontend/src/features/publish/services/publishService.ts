import axios from "axios";
import type { Publication } from "../types/publication";
import type { PublishRequest } from "../types/publish";

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export async function getPublications(
  workspaceId: string,
): Promise<Publication[]> {
  const response = await axios.get(
    `${API_URL}/publish/${workspaceId}`,
  );

  return response.data || [];
}

export async function publishContent(data: PublishRequest) {
  const response = await axios.post(
    `${API_URL}/publish`,
    data,
  );

  return response.data;
}

export async function publishContentItem(
  contentItemId: string,
  platform: "medium" | "wordpress" | "ghost",
) {
  const response = await axios.post(
    `${API_URL}/publish/content-item/${contentItemId}`,
    {
      platform,
    },
  );

  return response.data;
}