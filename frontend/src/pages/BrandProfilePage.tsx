import { useMutation, useQuery } from "@tanstack/react-query";

import BrandProfileForm from "@/components/brand/BrandProfileForm";

import {
  createBrandProfile,
  getBrandProfile,
  updateBrandProfile,
} from "@/services/brandService";

import type { BrandFormValues } from "@/schemas/brandSchema";

import { useWorkspace } from "@/features/workspace/context/useWorkspace";

export default function BrandProfilePage() {
  const { workspace } = useWorkspace();

  const workspaceId = workspace?.id;

  const brandQuery = useQuery({
    queryKey: ["brand", workspaceId],

    queryFn: () =>
      getBrandProfile(workspaceId!),

    enabled: !!workspaceId,

    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: createBrandProfile,

    onSuccess: () => {
      brandQuery.refetch();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: BrandFormValues;
    }) =>
      updateBrandProfile(
        workspaceId,
        data,
      ),

    onSuccess: () => {
      brandQuery.refetch();
    },
  });

  const handleSubmit = (
    data: BrandFormValues,
  ) => {
    if (!workspaceId) {
      return;
    }

    if (brandQuery.data) {
      updateMutation.mutate({
        workspaceId,
        data,
      });

      return;
    }

    createMutation.mutate({
      workspace_id: workspaceId,
      ...data,
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Brand Memory
        </h1>

        <p className="text-muted-foreground mt-2">
          Teach ContentCrew how your brand
          communicates.
        </p>
      </div>

      <BrandProfileForm
        initialData={brandQuery.data}
        onSubmit={handleSubmit}
        isLoading={
          createMutation.isPending ||
          updateMutation.isPending
        }
      />
    </div>
  );
}
