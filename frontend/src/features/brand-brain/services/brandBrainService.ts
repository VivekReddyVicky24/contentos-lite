import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://127.0.0.1:8000";


export async function askBrandBrain(
  workspaceId: string,
  question: string,
) {
  const response =
    await axios.post(
      `${API_URL}/brand-brain/chat`,
      {
        workspace_id: workspaceId,
        question,
      },
    );

  return response.data;
}


export async function getBrandHistory(
  workspaceId: string,
) {
  const response =
    await axios.get(
      `${API_URL}/brand-brain/history/${workspaceId}`,
    );

  return response.data;
}