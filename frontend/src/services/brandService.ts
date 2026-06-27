import axios from "axios";
import type {
  BrandProfile,
  BrandProfileUpdate,
} from "@/types/brand";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const getBrandProfile = async (
  workspaceId: string,
) => {
  const response = await api.get<BrandProfile>(
    `/brand/${workspaceId}`,
  );

  return response.data;
};

export const createBrandProfile = async (
  data: BrandProfile,
) => {
  const response = await api.post(
    "/brand/",
    data,
  );

  return response.data;
};

export const updateBrandProfile = async (
  workspaceId: string,
  data: BrandProfileUpdate,
) => {
  const response = await api.put(
    `/brand/${workspaceId}`,
    data,
  );

  return response.data;
};
