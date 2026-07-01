import {
  useState,
} from "react";
import { Send } from "lucide-react";

interface Props {

  onPublish: (
    platform: string,
    title: string,
    content: string,
  ) => Promise<void>;
}


export default function PublishForm({
  onPublish,
}: Props) {

  const [platform, setPlatform] =
    useState("medium");

  const [title, setTitle] =
    useState("");

  const [content, setContent] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  async function handleSubmit(
    e: React.FormEvent,
  ) {

    e.preventDefault();

    try {

      setLoading(true);

      await onPublish(
        platform,
        title,
        content,
      );

      setTitle("");
      setContent("");

    } finally {

      setLoading(false);

    }
  }


  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm"
    >

      <label className="block">
        <span className="text-sm font-medium text-slate-700">
          Platform
        </span>
        <select
          value={platform}
          onChange={(e) =>
            setPlatform(
              e.target.value,
            )
          }
          className="mt-2 w-full rounded-md border border-slate-300 p-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        >

          <option value="medium">
            Medium
          </option>

          <option value="wordpress">
            WordPress
          </option>

          <option value="ghost">
            Ghost
          </option>

        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">
          Title
        </span>
        <input
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value,
            )
          }
          placeholder="AI Fitness Marketing"
          className="mt-2 w-full rounded-md border border-slate-300 p-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">
          Content
        </span>
        <textarea
          rows={8}
          value={content}
          onChange={(e) =>
            setContent(
              e.target.value,
            )
          }
          placeholder="Hello world"
          className="mt-2 w-full resize-none rounded-md border border-slate-300 p-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          required
        />
      </label>

      <button
        disabled={
          loading ||
          !title.trim() ||
          !content.trim()
        }
        className="inline-flex h-10 items-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
      >
        <Send className="size-4" />
        {loading ? "Scheduling..." : "Schedule"}
      </button>

    </form>
  );
}
