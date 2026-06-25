import axios from "axios";

import type {
  BrandBrainResponse,
} from "../types/brandBrain";

const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://127.0.0.1:8000";

export async function askBrandBrain(
  question: string,
  workspaceId: string,
): Promise<BrandBrainResponse> {
  const response =
    await axios.post(
      `${API_URL}/brand-brain/query`,
      {
        question,
        workspace_id: workspaceId,
      },
    );

  return response.data;
}

export async function streamBrandBrain(
  question: string,
  workspaceId: string,
  onChunk: (
    text: string,
  ) => void,
) {

  const response =
    await fetch(
      `${API_URL}/brand-brain/stream`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          question,
          workspace_id:
            workspaceId,
        }),
      },
    );

  const reader =
    response.body?.getReader();

  if (!reader) return;

  const decoder =
    new TextDecoder();

  while (true) {

    const {
      done,
      value,
    } = await reader.read();

    if (done) break;

    const chunk =
      decoder.decode(value);

    onChunk(chunk);
  }
}