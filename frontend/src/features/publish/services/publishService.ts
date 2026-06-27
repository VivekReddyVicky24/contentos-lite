import axios from "axios";

import type {
  Publication,
} from "../types/publication";

const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://127.0.0.1:8000";


export async function getPublications(
  workspaceId: string,
): Promise<Publication[]> {

  const response =
    await axios.get(
      `${API_URL}/publish/${workspaceId}`,
    );

  return response.data;
}