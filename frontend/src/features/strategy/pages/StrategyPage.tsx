import {
  useEffect,
  useState,
} from "react";

import { useWorkspace } from "@/features/workspace/context/useWorkspace";

import {
  getStrategy,
} from "../services/strategyService";

import type {
  Strategy,
} from "../types/strategy";


export default function StrategyPage() {

  const {
    workspace,
  } = useWorkspace();

  const [
    strategy,
    setStrategy,
  ] = useState<Strategy | null>(() => {
    const cached =
      localStorage.getItem(
        "strategy-cache",
      );

    if (!cached) {
      return null;
    }

    try {
      return JSON.parse(cached);
    } catch {
      return null;
    }
  });

  const [loading, setLoading] =
    useState(strategy === null);


  useEffect(() => {
    if (!workspace) {
      return;
    }

    if (strategy) {
      return;
    }

    setLoading(true);

    getStrategy(
      workspace.id,
    )
      .then((data) => {
        setStrategy(data);
        localStorage.setItem(
          "strategy-cache",
          JSON.stringify(data),
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [workspace, strategy]);


  if (loading) {
    return (
      <div className="p-8">
        Generating strategy...
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
          onClick={() => {
            localStorage.removeItem(
              "strategy-cache",
            );
            window.location.reload();
          }}
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          Regenerate Strategy
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">

        <section className="rounded-xl border p-6">

          <h2 className="mb-4 text-2xl font-bold">
            Monthly Objectives
          </h2>

          <ul className="space-y-2">

            {strategy.monthly_objectives.map(
              (item, index) => {
                const objectiveItem = item as
                  | string
                  | {
                      title?: string;
                      description?: string;
                    };

                if (typeof objectiveItem === "string") {
                  return (
                    <li key={index}>
                      • {objectiveItem}
                    </li>
                  );
                }

                return (
                  <li key={index}>
                    <div className="font-semibold">
                      {objectiveItem.title ?? "Objective"}
                    </div>
                    {objectiveItem.description && (
                      <div className="text-sm text-gray-500">
                        {objectiveItem.description}
                      </div>
                    )}
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
              (item, index) => {
                const themeItem = item as
                  | string
                  | {
                      name?: string;
                      description?: string;
                      primary_channels?: string[];
                    };

                if (typeof themeItem === "string") {
                  return (
                    <li key={index}>
                      • {themeItem}
                    </li>
                  );
                }

                return (
                  <li key={index}>
                    <div className="font-semibold">
                      {themeItem.name ?? "Theme"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {themeItem.description ?? ""}
                    </div>
                    {themeItem.primary_channels && (
                      <div className="mt-1 text-xs text-gray-400">
                        Channels: {themeItem.primary_channels.join(", ")}
                      </div>
                    )}
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
              (item, index) => {
                const channelItem = item as
                  | string
                  | {
                      name?: string;
                      reason?: string;
                    };

                if (typeof channelItem === "string") {
                  return (
                    <li key={index}>
                      • {channelItem}
                    </li>
                  );
                }

                return (
                  <li key={index}>
                    <div className="font-semibold">
                      {channelItem.name ?? "Channel"}
                    </div>
                    {channelItem.reason && (
                      <div className="text-sm text-gray-500">
                        {channelItem.reason}
                      </div>
                    )}
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
              (item, index) => {
                const campaignItem = item as
                  | string
                  | {
                      title?: string;
                      description?: string;
                    };

                if (typeof campaignItem === "string") {
                  return (
                    <li key={index}>
                      • {campaignItem}
                    </li>
                  );
                }

                return (
                  <li key={index}>
                    <div className="font-semibold">
                      {campaignItem.title ?? "Campaign Idea"}
                    </div>
                    {campaignItem.description && (
                      <div className="text-sm text-gray-500">
                        {campaignItem.description}
                      </div>
                    )}
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