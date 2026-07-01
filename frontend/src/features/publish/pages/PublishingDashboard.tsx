import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  CalendarClock,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

import {
  useWorkspace,
} from "@/features/workspace/context";

import PublishForm from "../components/PublishForm";

import {
  getPublications,
  publishContent,
} from "../services/publishService";

import type {
  Publication,
} from "../types/publication";


export default function PublishingDashboard() {

  const {
    workspace,
  } = useWorkspace();

  const [
    publications,
    setPublications,
  ] = useState<Publication[]>([]);

  const [loading, setLoading] =
    useState(true);


  const refresh =
    useCallback(async () => {

      if (!workspace) {
        setPublications([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data =
          await getPublications(
            workspace.id,
          );

        setPublications(data);
      } catch (error) {
        console.error(error);
        toast.error(
          "Could not load publications.",
        );
      } finally {
        setLoading(false);
      }
    }, [workspace]);


  useEffect(() => {

    void Promise.resolve().then(
      refresh,
    );

  }, [refresh]);


  async function handlePublish(
    platform: string,
    title: string,
    content: string,
  ) {

    if (!workspace) {
      return;
    }

    try {
      await publishContent({
        workspace_id:
          workspace.id,

        platform:
          platform as
            | "medium"
            | "wordpress"
            | "ghost",

        title,
        content,
      });

      await refresh();
      toast.success(
        "Publication scheduled.",
      );
    } catch (error) {
      console.error(error);
      toast.error(
        "Publishing failed.",
      );
      throw error;
    }
  }


  return (

    <div className="space-y-6 text-left">

      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Distribution
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Publishing Center
        </h1>
        <p className="mt-2 text-slate-500">
          Schedule content and verify publication history by workspace.
        </p>
      </div>

      <PublishForm
        onPublish={
          handlePublish
        }
      />

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">

        {loading ? (
          <div className="p-6 text-sm text-slate-500">
            Loading publications...
          </div>
        ) : publications.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">
            No publishing history yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {publications.map(
              (publication) => (

                <div
                  key={publication.id}
                  className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between"
                >

                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">
                      {publication.title}
                    </h2>

                    <p className="mt-1 text-sm capitalize text-slate-500">
                      {publication.platform}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 ring-1 ring-sky-200">
                      <CalendarClock className="size-3" />
                      {publication.status}
                    </span>

                    {publication.published_url && (
                      <a
                        href={publication.published_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-grid size-9 place-items-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
                        aria-label="Open publication"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                  </div>

                </div>

              ),
            )}
          </div>
        )}

      </div>

    </div>
  );
}
