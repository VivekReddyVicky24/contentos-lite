import { useState } from "react";

import { useWorkspace }
from "@/features/workspace/context/WorkspaceContext";

import {
  createBrandProfile,
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

  const [loading, setLoading] =
    useState(false);


  async function handleSubmit(
    e: React.FormEvent,
  ) {

    e.preventDefault();

    if (!workspace) {
      return;
    }

    try {

      setLoading(true);

      await createBrandProfile({
        workspace_id: workspace.id,

        company_name: companyName,

        brand_voice: brandVoice,

        target_audience: targetAudience,

        content_goals: contentGoals,

        preferred_platforms:
          platforms
            .split(",")
            .map((p) => p.trim()),
      });

      alert(
        "Brand profile saved successfully!",
      );

    } catch (error) {

      console.error(error);

      alert(
        "Failed to save brand profile.",
      );

    } finally {

      setLoading(false);

    }
  }


  return (

    <div className="mx-auto max-w-3xl p-8">

      <h1 className="mb-8 text-5xl font-bold">
        Brand Setup
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          placeholder="Company Name"
          value={companyName}
          onChange={(e) =>
            setCompanyName(
              e.target.value,
            )
          }
          className="w-full rounded border p-3"
        />

        <textarea
          placeholder="Brand Voice"
          value={brandVoice}
          onChange={(e) =>
            setBrandVoice(
              e.target.value,
            )
          }
          className="w-full rounded border p-3"
        />

        <textarea
          placeholder="Target Audience"
          value={targetAudience}
          onChange={(e) =>
            setTargetAudience(
              e.target.value,
            )
          }
          className="w-full rounded border p-3"
        />

        <textarea
          placeholder="Content Goals"
          value={contentGoals}
          onChange={(e) =>
            setContentGoals(
              e.target.value,
            )
          }
          className="w-full rounded border p-3"
        />

        <input
          placeholder="Platforms (comma separated)"
          value={platforms}
          onChange={(e) =>
            setPlatforms(
              e.target.value,
            )
          }
          className="w-full rounded border p-3"
        />

        <button
          disabled={loading}
          className="rounded bg-black px-6 py-3 text-white"
        >
          Save Brand Profile
        </button>

      </form>

    </div>
  );
}