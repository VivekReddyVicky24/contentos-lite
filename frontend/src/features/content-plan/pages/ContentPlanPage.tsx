import {
  useEffect,
  useState,
} from "react";

import { useWorkspace } from "@/features/workspace/context";

import {
  addContentItem,
  getContentItems,
  getMonthlyPlan,
  regenerateMonthlyPlan,
} from "../services/contentPlanService";

import type {
  ContentPlan,
} from "../types/contentPlan";


interface ContentItem {
  id: string;
  title: string;
  topic: string;
  channel: string;
  status: string;
}


export default function ContentPlanPage() {

  const { workspace } =
    useWorkspace();

  const [plan, setPlan] =
    useState<ContentPlan | null>(null);

  const [contentItems, setContentItems] =
    useState<ContentItem[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [regenerating, setRegenerating] =
    useState(false);

  const [error, setError] =
    useState("");


  useEffect(() => {
    if (!workspace?.id) return;

    const loadData = async () => {
      try {
        setLoading(true);

        const cacheKey =
          `content-plan-${workspace.id}`;

        const cachedPlan =
          localStorage.getItem(cacheKey);

        if (cachedPlan) {
          try {
            setPlan(
              JSON.parse(cachedPlan),
            );
          } catch {
            localStorage.removeItem(cacheKey);
          }
        }

        const [savedPlan, items] =
          await Promise.all([
            getMonthlyPlan(
              workspace.id,
            ),
            getContentItems(
              workspace.id,
            ),
          ]);

        if (savedPlan?.weeks?.length) {
          setPlan(savedPlan);

          localStorage.setItem(
            cacheKey,
            JSON.stringify(savedPlan),
          );
        }

        setContentItems(items || []);
      } catch (error) {
        console.error(
          "Failed to load content planner:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [workspace?.id]);


  async function handleAddToQueue(
    title: string,
    channel: string,
  ) {

    if (!workspace) {
      return;
    }

    try {

      const item =
        await addContentItem(
          workspace.id,
          title,
          title,
          channel,
        );

      setContentItems(
        (previous) => [
          ...previous,
          item,
        ],
      );

    } catch (err) {

      console.error(err);

      setError(
        "Unable to add content to the queue.",
      );
    }
  }


  function isAlreadyQueued(
    title: string,
  ) {

    return contentItems.some(
      (item) =>
        item.title === title,
    );
  }


  const regeneratePlan = async () => {
    if (!workspace?.id) return;

    try {
      setRegenerating(true);

      const newPlan =
        await regenerateMonthlyPlan(
          workspace.id,
        );

      setPlan(newPlan);

      localStorage.setItem(
        `content-plan-${workspace.id}`,
        JSON.stringify(newPlan),
      );
    } catch (error) {
      console.error(
        "Failed to regenerate content plan:",
        error,
      );
    } finally {
      setRegenerating(false);
    }
  };


  if (loading && !plan) {

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


  if (error && !plan) {

    return (
      <div className="mx-auto max-w-7xl p-8">

        <h1 className="mb-4 text-4xl font-bold">
          Content Planner
        </h1>

        <div className="rounded-xl border p-6">

          <p className="mb-4 text-red-600">
            {error}
          </p>

          <button
            onClick={regeneratePlan}
            disabled={regenerating}
            className="rounded-lg bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {regenerating
              ? "Generating..."
              : "Try Again"}
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
          disabled={regenerating}
          className="rounded-lg bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {regenerating
            ? "Generating..."
            : "Regenerate Plan"}
        </button>

      </div>


      {error && (
        <div className="mb-6 rounded-lg border border-red-200 p-4 text-red-600">
          {error}
        </div>
      )}


      <div className="mb-8 rounded-xl border p-6">

        <h2 className="text-2xl font-bold">
          {plan.month}
        </h2>

        <p className="mt-2 text-gray-500">
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
                    (post, index) => {

                      const queued =
                        isAlreadyQueued(
                          post.title,
                        );

                      return (
                        <article
                          key={`${week.week}-${index}`}
                          className="rounded-xl border p-5"
                        >

                          <div className="mb-3 flex items-center justify-between">

                            <span className="rounded-full border px-3 py-1 text-sm">
                              {post.platform}
                            </span>

                            <span className="text-sm text-gray-500">
                              {post.type}
                            </span>

                          </div>


                          <h3 className="mb-4 font-semibold">
                            {post.title}
                          </h3>


                          <button
                            disabled={queued}
                            onClick={() =>
                              handleAddToQueue(
                                post.title,
                                post.platform,
                              )
                            }
                            className={
                              queued
                                ? "w-full rounded-lg border px-4 py-2 text-gray-400"
                                : "w-full rounded-lg bg-black px-4 py-2 text-white"
                            }
                          >
                            {queued
                              ? "✓ In Content Queue"
                              : "Add to Content Queue"}
                          </button>

                        </article>
                      );
                    },
                  )}

                </div>
              )}

            </section>
          ),
        )}

      </div>


      <section className="mt-10">

        <h2 className="mb-4 text-2xl font-bold">
          Content Queue
        </h2>

        {contentItems.length === 0 ? (

          <div className="rounded-xl border p-6 text-gray-500">
            No content items have been added yet.
          </div>

        ) : (

          <div className="space-y-3">

            {contentItems.map(
              (item) => (

                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border p-5"
                >

                  <div>

                    <h3 className="font-semibold">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {item.channel}
                    </p>

                  </div>


                  <span className="rounded-full border px-3 py-1 text-sm">
                    {item.status}
                  </span>

                </div>

              ),
            )}

          </div>
        )}

      </section>

    </div>
  );
}