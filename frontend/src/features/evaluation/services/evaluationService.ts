import axios from "axios";

import type {
  Evaluation,
} from "../types/evaluation";

const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://127.0.0.1:8000";


export async function getEvaluations(
  workspaceId: string,
): Promise<Evaluation[]> {

  const response =
    await axios.get(
      `${API_URL}/evaluations/${workspaceId}`,
    );

  return response.data;
}