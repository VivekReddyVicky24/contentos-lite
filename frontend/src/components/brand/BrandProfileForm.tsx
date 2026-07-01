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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <Label className="text-sm font-medium text-slate-700">
          Company Name
        </Label>

        <Input
          {...register("company_name")}
          className="mt-2"
        />

        <p className="mt-1 text-sm text-rose-600">
          {errors.company_name?.message}
        </p>
      </div>

      <div>
        <Label className="text-sm font-medium text-slate-700">
          Brand Voice
        </Label>

        <textarea
          {...register("brand_voice")}
          rows={4}
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
        />

        <p className="mt-1 text-sm text-rose-600">
          {errors.brand_voice?.message}
        </p>
      </div>

      <div>
        <Label className="text-sm font-medium text-slate-700">
          Target Audience
        </Label>

        <textarea
          {...register("target_audience")}
          rows={4}
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
        />

        <p className="mt-1 text-sm text-rose-600">
          {errors.target_audience?.message}
        </p>
      </div>

      <div>
        <Label className="text-sm font-medium text-slate-700">
          Content Goals
        </Label>

        <textarea
          {...register("content_goals")}
          rows={4}
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
        />

        <p className="mt-1 text-sm text-rose-600">
          {errors.content_goals?.message}
        </p>
      </div>

      <div>
        <Label className="text-sm font-medium text-slate-700">
          Preferred Platforms
        </Label>

        <div className="mt-3 flex flex-wrap gap-3">
          {PLATFORMS.map((platform) => (
            <label
              key={platform}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
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

        <p className="mt-2 text-sm text-rose-600">
          {errors.preferred_platforms?.message}
        </p>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full sm:w-auto"
      >
        {isLoading
          ? "Saving..."
          : "Save Brand Profile"}
      </Button>
    </form>
  );
}
