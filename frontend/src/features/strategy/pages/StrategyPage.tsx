import {
  useState,
} from "react";

import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useWorkspace } from "@/features/workspace/context/useWorkspace";

import {
  getStrategy,
  regenerateStrategy,
} from "../services/strategyService";

import type {
  Strategy,
} from "../types/strategy";

export default function StrategyPage() {

  const {
    workspace,
  } = useWorkspace();

  const queryClient =
    useQueryClient();

  const [
    regenerating,
    setRegenerating,
  ] = useState(false);

  const {
    data: strategy = null,
    isLoading,
    isError,
  } = useQuery<Strategy>({
    queryKey: [
      "strategy",
      workspace?.id,
    ],

    queryFn: () =>
      getStrategy(
        workspace!.id,
      ),

    enabled:
      !!workspace?.id,

    staleTime: 30_000,
  });

  async function handleRegenerateStrategy() {

    if (!workspace?.id) {
      return;
    }

    try {

      setRegenerating(true);

      await regenerateStrategy(
        workspace.id,
      );

      await queryClient.invalidateQueries({
        queryKey: [
          "strategy",
          workspace.id,
        ],
      });

    } catch (error) {

      console.error(
        "Failed to regenerate strategy:",
        error,
      );

    } finally {

      setRegenerating(false);

    }
  }

  if (
    isLoading &&
    !strategy
  ) {

    return (
      <div className="p-8">

        Loading strategy...

      </div>
    );
  }

  if (
    isError &&
    !strategy
  ) {

    return (
      <div className="p-8">

        <p className="text-red-600">
          Unable to load strategy.
        </p>

        <button
          onClick={() =>
            queryClient.invalidateQueries({
              queryKey: [
                "strategy",
                workspace?.id,
              ],
            })
          }
          className="mt-4 rounded-lg bg-black px-4 py-2 text-white"
        >
          Try Again
        </button>

      </div>
    );
  }

  if (!strategy) {
    return null;
  }

  return (

    <div className="mx-auto max-w-7xl p-8">

      <div className="mb-8 flex items-center justify-between">

        <h1 className="text-4xl font-bold">
          AI Strategist
        </h1>

        <button
          onClick={
            handleRegenerateStrategy
          }
          disabled={
            regenerating
          }
          className="rounded-lg bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {regenerating
            ? "Generating..."
            : "Regenerate Strategy"}
        </button>

      </div>

      <div className="grid gap-8 lg:grid-cols-2">

        <section className="rounded-xl border p-6">

          <h2 className="mb-4 text-2xl font-bold">
            Monthly Objectives
          </h2>

          <ul className="space-y-2">

            {strategy.monthly_objectives.map(
              (
                item,
                index,
              ) => {

                const objectiveItem =
                  item as
                    | string
                    | {
                        title?: string;
                        description?: string;
                      };

                if (
                  typeof objectiveItem ===
                  "string"
                ) {

                  return (
                    <li
                      key={index}
                    >
                      • {objectiveItem}
                    </li>
                  );
                }

                return (
                  <li
                    key={index}
                  >

                    <div className="font-semibold">
                      {
                        objectiveItem
                          .title ??
                        "Objective"
                      }
                    </div>

                    {
                      objectiveItem
                        .description && (
                        <div className="text-sm text-gray-500">
                          {
                            objectiveItem
                              .description
                          }
                        </div>
                      )
                    }

                  </li>
                );
              },
            )}

          </ul>

        </section>

        <section className="rounded-xl border p-6">

          <h2 className="mb-4 text-2xl font-bold">
            Content Themes
          </h2>

          <ul className="space-y-2">

            {strategy.content_themes.map(
              (
                item,
                index,
              ) => {

                const themeItem =
                  item as
                    | string
                    | {
                        name?: string;
                        description?: string;
                        primary_channels?: string[];
                      };

                if (
                  typeof themeItem ===
                  "string"
                ) {

                  return (
                    <li
                      key={index}
                    >
                      • {themeItem}
                    </li>
                  );
                }

                return (
                  <li
                    key={index}
                  >

                    <div className="font-semibold">
                      {
                        themeItem.name ??
                        "Theme"
                      }
                    </div>

                    <div className="text-sm text-gray-500">
                      {
                        themeItem
                          .description ??
                        ""
                      }
                    </div>

                    {
                      themeItem.primary_channels && (
                        <div className="mt-1 text-xs text-gray-400">
                          Channels:{" "}
                          {
                            themeItem
                              .primary_channels
                              .join(", ")
                          }
                        </div>
                      )
                    }

                  </li>
                );
              },
            )}

          </ul>

        </section>

        <section className="rounded-xl border p-6">

          <h2 className="mb-4 text-2xl font-bold">
            Recommended Channels
          </h2>

          <ul className="space-y-2">

            {strategy.recommended_channels.map(
              (
                item,
                index,
              ) => {

                const channelItem =
                  item as
                    | string
                    | {
                        name?: string;
                        reason?: string;
                      };

                if (
                  typeof channelItem ===
                  "string"
                ) {

                  return (
                    <li
                      key={index}
                    >
                      • {channelItem}
                    </li>
                  );
                }

                return (
                  <li
                    key={index}
                  >

                    <div className="font-semibold">
                      {
                        channelItem.name ??
                        "Channel"
                      }
                    </div>

                    {
                      channelItem.reason && (
                        <div className="text-sm text-gray-500">
                          {
                            channelItem.reason
                          }
                        </div>
                      )
                    }

                  </li>
                );
              },
            )}

          </ul>

        </section>

        <section className="rounded-xl border p-6">

          <h2 className="mb-4 text-2xl font-bold">
            Campaign Ideas
          </h2>

          <ul className="space-y-2">

            {strategy.campaign_ideas.map(
              (
                item,
                index,
              ) => {

                const campaignItem =
                  item as
                    | string
                    | {
                        title?: string;
                        description?: string;
                      };

                if (
                  typeof campaignItem ===
                  "string"
                ) {

                  return (
                    <li
                      key={index}
                    >
                      • {campaignItem}
                    </li>
                  );
                }

                return (
                  <li
                    key={index}
                  >

                    <div className="font-semibold">
                      {
                        campaignItem
                          .title ??
                        "Campaign Idea"
                      }
                    </div>

                    {
                      campaignItem
                        .description && (
                        <div className="text-sm text-gray-500">
                          {
                            campaignItem
                              .description
                          }
                        </div>
                      )
                    }

                  </li>
                );
              },
            )}

          </ul>

        </section>

      </div>

      <div className="mt-8 rounded-xl border p-6">

        <h2 className="mb-4 text-2xl font-bold">
          Weekly Plan
        </h2>

        <div className="space-y-4">

          {strategy.weekly_plan.map(
            (plan) => (

              <div
                key={plan.week}
                className="rounded-lg border p-4"
              >

                <div className="font-bold">
                  Week {plan.week}
                </div>

                <div>
                  Topic:
                  {" "}
                  {plan.topic}
                </div>

                <div>
                  Channel:
                  {" "}
                  {plan.channel}
                </div>

              </div>

            ),
          )}

        </div>

      </div>

    </div>
  );
}
