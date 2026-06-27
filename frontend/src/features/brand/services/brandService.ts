import axios from "axios";

import type {
  BrandProfile,
} from "../types/brand";

const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://127.0.0.1:8000";


export async function getBrandProfile(
  workspaceId: string,
) {

  const response =
    await axios.get(
      `${API_URL}/brand/${workspaceId}`,
    );

  return response.data;
}


export async function createBrandProfile(
  data: BrandProfile,
) {

  const response =
    await axios.post(
      `${API_URL}/brand`,
      data,
    );

  return response.data;
}


export async function updateBrandProfile(
  workspaceId: string,
  data: BrandProfile,
) {

  const response =
    await axios.put(
      `${API_URL}/brand/${workspaceId}`,
      data,
    );

  return response.data;
}