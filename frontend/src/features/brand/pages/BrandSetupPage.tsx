import {
  Save,
  Sparkles,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import { useWorkspace }
from "@/features/workspace/context";

import {
  createBrandProfile,
  getBrandProfile,
  updateBrandProfile,
} from "../services/brandService";


export default function BrandSetupPage() {

  const { workspace } =
    useWorkspace();

  const [companyName, setCompanyName] =
    useState("");

  const [brandVoice, setBrandVoice] =
    useState("");

  const [targetAudience, setTargetAudience] =
    useState("");

  const [contentGoals, setContentGoals] =
    useState("");

  const [platforms, setPlatforms] =
    useState("");

  const [hasProfile, setHasProfile] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    if (!workspace) {
      return;
    }

    async function loadProfile() {
      if (!workspace) return;

      setLoading(true);

      try {
        const profile =
          await getBrandProfile(
            workspace.id,
          );

        if (!profile) {
          setHasProfile(false);
          return;
        }

        setHasProfile(true);
        setCompanyName(
          profile.company_name ?? "",
        );
        setBrandVoice(
          profile.brand_voice ?? "",
        );
        setTargetAudience(
          profile.target_audience ?? "",
        );
        setContentGoals(
          profile.content_goals ?? "",
        );
        setPlatforms(
          (
            profile.preferred_platforms ??
            []
          ).join(", "),
        );
      } catch (error) {
        console.error(error);
        toast.error(
          "Could not load brand profile.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadProfile();
  }, [workspace]);

  async function handleSubmit(
    e: React.FormEvent,
  ) {

    e.preventDefault();

    if (!workspace) {
      return;
    }

    const payload = {
      workspace_id: workspace.id,
      company_name: companyName.trim(),
      brand_voice: brandVoice.trim(),
      target_audience:
        targetAudience.trim(),
      content_goals:
        contentGoals.trim(),
      preferred_platforms:
        platforms
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean),
    };

    try {

      setSaving(true);

      if (hasProfile) {
        await updateBrandProfile(
          workspace.id,
          payload,
        );
      } else {
        await createBrandProfile(
          payload,
        );
        setHasProfile(true);
      }

      toast.success(
        "Brand profile saved.",
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to save brand profile.",
      );

    } finally {

      setSaving(false);

    }
  }


  return (

    <div className="mx-auto max-w-4xl space-y-6 text-left">

      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Brand Memory
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Brand Setup
        </h1>
        <p className="mt-2 text-slate-500">
          Keep the workspace voice, audience, goals, and channel policy in one editable profile.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >

        <div className="mb-6 flex items-center gap-3 rounded-md bg-emerald-50 p-4 text-emerald-800">
          <Sparkles className="size-5" />
          <p className="text-sm">
            {loading
              ? "Loading profile..."
              : hasProfile
                ? "Existing profile loaded for this workspace."
                : "No profile found yet. Saving will create one."}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Company
            </span>
            <input
              placeholder="FitForge"
              value={companyName}
              onChange={(e) =>
                setCompanyName(
                  e.target.value,
                )
              }
              className="mt-2 w-full rounded-md border border-slate-300 p-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Platforms
            </span>
            <input
              placeholder="LinkedIn, Blog"
              value={platforms}
              onChange={(e) =>
                setPlatforms(
                  e.target.value,
                )
              }
              className="mt-2 w-full rounded-md border border-slate-300 p-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4">
          {[
            [
              "Voice",
              brandVoice,
              setBrandVoice,
              "Professional, energetic, science-based",
            ],
            [
              "Audience",
              targetAudience,
              setTargetAudience,
              "Busy professionals aged 25-40",
            ],
            [
              "Goals",
              contentGoals,
              setContentGoals,
              "Generate leads",
            ],
          ].map(
            ([label, value, setter, placeholder]) => (
              <label
                key={label as string}
                className="block"
              >
                <span className="text-sm font-medium text-slate-700">
                  {label as string}
                </span>
                <textarea
                  rows={3}
                  placeholder={placeholder as string}
                  value={value as string}
                  onChange={(e) =>
                    (
                      setter as React.Dispatch<
                        React.SetStateAction<string>
                      >
                    )(e.target.value)
                  }
                  className="mt-2 w-full resize-none rounded-md border border-slate-300 p-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </label>
            ),
          )}
        </div>

        <button
          disabled={saving || loading}
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          <Save className="size-4" />
          {saving
            ? "Saving..."
            : "Save Brand Profile"}
        </button>

      </form>

    </div>
  );
}
