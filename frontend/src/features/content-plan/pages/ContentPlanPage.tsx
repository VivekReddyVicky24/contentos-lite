import {
  useEffect,
  useState,
} from "react";

import { useWorkspace } from "@/features/workspace/context";

import {
  addContentItem,
  approveContent,
  generateContent,
  getContentItems,
  getMonthlyPlan,
  regenerateMonthlyPlan,
  rejectContent,
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
  content?: {
    title?: string;
    introduction?: string;
    sections?: Array<{
      heading?: string;
      content?: string;
    }>;
    conclusion?: string;
    call_to_action?: string;
    editor_notes?: string[];
  };
  evaluation?: {
    overall_score?: number;
    readability?: number;
    brand_alignment?: number;
    groundedness?: number;
    [key: string]: unknown;
  };
  approval_status?: string;
  reviewer_notes?: string;
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

  const [generatingId, setGeneratingId] =
    useState<string | null>(null);

  const [reviewItem, setReviewItem] =
    useState<ContentItem | null>(null);

  const [reviewerNotes, setReviewerNotes] =
    useState("");

  const [approvalLoading, setApprovalLoading] =
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

  const handleGenerateContent = async (
    contentItemId: string,
  ) => {
    if (!workspace?.id) return;

    try {
      setGeneratingId(contentItemId);

      const response =
        await generateContent(
          contentItemId,
        );

      console.log(
        "Content generated:",
        response,
      );

      const items = await getContentItems(
        workspace.id,
      );

      setContentItems(items || []);
    } catch (error) {
      console.error(
        "Content generation failed:",
        error,
      );
    } finally {
      setGeneratingId(null);
    }
  };

  const handleApprove = async () => {
    if (!reviewItem || !workspace?.id) return;

    try {
      setApprovalLoading(true);

      await approveContent(
        reviewItem.id,
        reviewerNotes,
      );

      const items =
        await getContentItems(
          workspace.id,
        );

      setContentItems(items || []);
      setReviewItem(null);
      setReviewerNotes("");
    } catch (error) {
      console.error(
        "Approval failed:",
        error,
      );
    } finally {
      setApprovalLoading(false);
    }
  };

  const handleReject = async () => {
    if (!reviewItem || !workspace?.id) return;

    try {
      setApprovalLoading(true);

      await rejectContent(
        reviewItem.id,
        reviewerNotes,
      );

      const items =
        await getContentItems(
          workspace.id,
        );

      setContentItems(items || []);
      setReviewItem(null);
      setReviewerNotes("");
    } catch (error) {
      console.error(
        "Rejection failed:",
        error,
      );
    } finally {
      setApprovalLoading(false);
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
                  className="flex items-center justify-between gap-4 rounded-xl border p-5"
                >

                  <div>

                    <h3 className="font-semibold">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {item.channel}
                    </p>

                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        handleGenerateContent(item.id)
                      }
                      disabled={
                        generatingId === item.id ||
                        item.status === "generating"
                      }
                      className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {generatingId === item.id
                        ? "Generating..."
                        : item.status === "awaiting_approval"
                          ? "Regenerate Content"
                          : "Generate Content"}
                    </button>

                    {item.status === "awaiting_approval" && (
                      <button
                        onClick={() => {
                          setReviewItem(item);
                          setReviewerNotes(
                            item.reviewer_notes || "",
                          );
                        }}
                        className="rounded-lg border px-4 py-2 text-sm"
                      >
                        Review Content
                      </button>
                    )}

                    <span className="rounded-full border px-3 py-1 text-sm">
                      {item.status}
                    </span>
                  </div>

                </div>

              ),
            )}

          </div>
        )}

      </section>

      {reviewItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "24px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              width: "min(900px, 100%)",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "32px",
            }}
          >
            <h2>
              Review Generated Content
            </h2>

            <p
              style={{
                color: "#64748b",
                marginBottom: "24px",
              }}
            >
              {reviewItem.channel}
            </p>

            {reviewItem.content ? (
              <>
                <h3>
                  {reviewItem.content.title ||
                    reviewItem.title}
                </h3>

                {reviewItem.content.introduction && (
                  <section>
                    <h4>Introduction</h4>

                    <p>
                      {reviewItem.content.introduction}
                    </p>
                  </section>
                )}

                {reviewItem.content.sections?.map(
                  (section, index) => (
                    <section
                      key={index}
                      style={{
                        marginTop: "20px",
                      }}
                    >
                      <h4>
                        {section.heading ||
                          `Section ${index + 1}`}
                      </h4>

                      <p>
                        {section.content}
                      </p>
                    </section>
                  ),
                )}

                {reviewItem.content.conclusion && (
                  <section
                    style={{
                      marginTop: "20px",
                    }}
                  >
                    <h4>Conclusion</h4>

                    <p>
                      {reviewItem.content.conclusion}
                    </p>
                  </section>
                )}

                {reviewItem.content.call_to_action && (
                  <section
                    style={{
                      marginTop: "20px",
                    }}
                  >
                    <h4>Call to Action</h4>

                    <p>
                      {reviewItem.content.call_to_action}
                    </p>
                  </section>
                )}
              </>
            ) : (
              <p>
                No generated content available.
              </p>
            )}

            {reviewItem.evaluation && (
              <section
                style={{
                  marginTop: "32px",
                  padding: "20px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                }}
              >
                <h3>AI Evaluation</h3>

                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    fontSize: "14px",
                  }}
                >
                  {JSON.stringify(
                    reviewItem.evaluation,
                    null,
                    2,
                  )}
                </pre>
              </section>
            )}

            <section
              style={{
                marginTop: "24px",
              }}
            >
              <h3>Reviewer Notes</h3>

              <textarea
                value={reviewerNotes}
                onChange={(event) =>
                  setReviewerNotes(
                    event.target.value,
                  )
                }
                placeholder="Add feedback or approval notes..."
                rows={5}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  resize: "vertical",
                }}
              />
            </section>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "24px",
              }}
            >
              <button
                onClick={() => {
                  setReviewItem(null);
                  setReviewerNotes("");
                }}
                disabled={approvalLoading}
              >
                Cancel
              </button>

              <button
                onClick={handleReject}
                disabled={approvalLoading}
              >
                {approvalLoading
                  ? "Processing..."
                  : "Reject"}
              </button>

              <button
                onClick={handleApprove}
                disabled={approvalLoading}
              >
                {approvalLoading
                  ? "Processing..."
                  : "Approve"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}