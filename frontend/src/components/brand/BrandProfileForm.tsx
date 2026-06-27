import { useEffect } from "react";
import {
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  brandSchema,
} from "@/schemas/brandSchema";

import type { BrandFormValues } from "@/schemas/brandSchema";
import type { BrandProfile } from "@/types/brand";

const PLATFORMS = [
  "LinkedIn",
  "Twitter",
  "Blog",
  "Instagram",
  "YouTube",
];

interface Props {
  initialData?: BrandProfile | null;
  onSubmit: (data: BrandFormValues) => void;
  isLoading: boolean;
}

export default function BrandProfileForm({
  initialData,
  onSubmit,
  isLoading,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),

    defaultValues: {
      company_name: "",
      brand_voice: "",
      target_audience: "",
      content_goals: "",
      preferred_platforms: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        company_name: initialData.company_name,
        brand_voice: initialData.brand_voice,
        target_audience: initialData.target_audience,
        content_goals: initialData.content_goals,
        preferred_platforms:
          initialData.preferred_platforms,
      });
    }
  }, [initialData, reset]);

  const selectedPlatforms =
    useWatch({
      control,
      name: "preferred_platforms",
    }) ?? [];

  const togglePlatform = (
    platform: string,
  ) => {
    const exists =
      selectedPlatforms.includes(platform);

    if (exists) {
      setValue(
        "preferred_platforms",
        selectedPlatforms.filter(
          (p) => p !== platform,
        ),
      );
    } else {
      setValue(
        "preferred_platforms",
        [...selectedPlatforms, platform],
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-3xl"
    >
      <div>
        <label className="font-medium">
          Company Name
        </label>

        <input
          {...register("company_name")}
          className="mt-2 w-full rounded-lg border p-3"
        />

        <p className="text-sm text-red-500">
          {errors.company_name?.message}
        </p>
      </div>

      <div>
        <label className="font-medium">
          Brand Voice
        </label>

        <textarea
          {...register("brand_voice")}
          rows={4}
          className="mt-2 w-full rounded-lg border p-3"
        />

        <p className="text-sm text-red-500">
          {errors.brand_voice?.message}
        </p>
      </div>

      <div>
        <label className="font-medium">
          Target Audience
        </label>

        <textarea
          {...register("target_audience")}
          rows={4}
          className="mt-2 w-full rounded-lg border p-3"
        />

        <p className="text-sm text-red-500">
          {errors.target_audience?.message}
        </p>
      </div>

      <div>
        <label className="font-medium">
          Content Goals
        </label>

        <textarea
          {...register("content_goals")}
          rows={4}
          className="mt-2 w-full rounded-lg border p-3"
        />

        <p className="text-sm text-red-500">
          {errors.content_goals?.message}
        </p>
      </div>

      <div>
        <label className="font-medium">
          Preferred Platforms
        </label>

        <div className="mt-3 flex flex-wrap gap-4">
          {PLATFORMS.map((platform) => (
            <label
              key={platform}
              className="flex items-center gap-2"
            >
              <input
                type="checkbox"
                checked={selectedPlatforms.includes(
                  platform,
                )}
                onChange={() =>
                  togglePlatform(platform)
                }
              />

              {platform}
            </label>
          ))}
        </div>

        <p className="text-sm text-red-500 mt-2">
          {errors.preferred_platforms?.message}
        </p>
      </div>

      <button
        disabled={isLoading}
        className="rounded-lg bg-primary px-6 py-3 text-white"
      >
        {isLoading
          ? "Saving..."
          : "Save Brand Profile"}
      </button>
    </form>
  );
}
