import {
  useEffect,
  useState,
} from "react";

import { useWorkspace } from "@/features/workspace/context";

import {
  getMonthlyPlan,
} from "../services/contentPlanService";

import type {
  ContentPlan,
} from "../types/contentPlan";


export default function ContentPlanPage() {

  const {
    workspace,
  } = useWorkspace();

  const [
    plan,
    setPlan,
  ] = useState<ContentPlan | null>(
    null,
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  useEffect(() => {

    if (!workspace) {
      return;
    }

    const cacheKey =
      `content-plan-${workspace.id}`;

    const cached =
      localStorage.getItem(
        cacheKey,
      );

    if (cached) {

      try {

        setPlan(
          JSON.parse(cached),
        );

        return;

      } catch {

        localStorage.removeItem(
          cacheKey,
        );
      }
    }

    setLoading(true);
    setError("");

    getMonthlyPlan(
      workspace.id,
    )
      .then((data) => {

        setPlan(data);

        localStorage.setItem(
          cacheKey,
          JSON.stringify(data),
        );

      })
      .catch((err) => {

        console.error(err);

        setError(
          "Unable to generate the content plan.",
        );

      })
      .finally(() => {

        setLoading(false);

      });

  }, [workspace]);


  function regeneratePlan() {

    if (!workspace) {
      return;
    }

    const cacheKey =
      `content-plan-${workspace.id}`;

    localStorage.removeItem(
      cacheKey,
    );

    setPlan(null);
    setLoading(true);
    setError("");

    getMonthlyPlan(
      workspace.id,
    )
      .then((data) => {

        setPlan(data);

        localStorage.setItem(
          cacheKey,
          JSON.stringify(data),
        );

      })
      .catch((err) => {

        console.error(err);

        setError(
          "Unable to regenerate the content plan.",
        );

      })
      .finally(() => {

        setLoading(false);

      });
  }


  if (loading) {

    return (
      <div className="mx-auto max-w-7xl p-8">

        <h1 className="mb-4 text-4xl font-bold">
          Content Planner
        </h1>

        <p>
          Creating your monthly content plan...
        </p>

      </div>
    );
  }


  if (error) {

    return (
      <div className="mx-auto max-w-7xl p-8">

        <h1 className="mb-4 text-4xl font-bold">
          Content Planner
        </h1>

        <div className="rounded-lg border p-6">

          <p className="mb-4 text-red-600">
            {error}
          </p>

          <button
            onClick={regeneratePlan}
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }


  if (!plan) {
    return null;
  }


  return (
    <div className="mx-auto max-w-7xl p-8">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Content Planner
          </h1>

          <p className="mt-2 text-gray-500">
            AI-generated monthly content calendar
          </p>

        </div>

        <button
          onClick={regeneratePlan}
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          Regenerate Plan
        </button>

      </div>


      <div className="mb-8 rounded-xl border p-6">

        <h2 className="mb-2 text-2xl font-bold">
          {plan.month}
        </h2>

        <p className="text-gray-500">
          Your AI-generated content calendar
        </p>

      </div>


      <div className="space-y-8">

        {plan.weeks.map(
          (week) => (

            <section
              key={week.week}
              className="rounded-xl border p-6"
            >

              <h2 className="mb-6 text-2xl font-bold">
                Week {week.week}
              </h2>


              {week.posts.length === 0 ? (

                <p className="text-gray-500">
                  No posts planned for this week.
                </p>

              ) : (

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                  {week.posts.map(
                    (post, index) => (

                      <article
                        key={`${week.week}-${index}`}
                        className="rounded-lg border p-5"
                      >

                        <div className="mb-3 flex items-center justify-between">

                          <span className="rounded-full border px-3 py-1 text-sm">
                            {post.platform}
                          </span>

                          <span className="text-sm text-gray-500">
                            {post.type}
                          </span>

                        </div>

                        <h3 className="font-semibold">
                          {post.title}
                        </h3>

                      </article>

                    ),
                  )}

                </div>
              )}

            </section>

          ),
        )}

      </div>

    </div>
  );
}