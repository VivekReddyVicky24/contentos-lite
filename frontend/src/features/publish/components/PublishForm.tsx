import {
  useState,
} from "react";

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

      alert(
        "Publication created.",
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
      className="space-y-4 rounded-xl border p-6"
    >

      <select
        value={platform}
        onChange={(e) =>
          setPlatform(
            e.target.value,
          )
        }
        className="w-full rounded border p-3"
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

      <input
        value={title}
        onChange={(e) =>
          setTitle(
            e.target.value,
          )
        }
        placeholder="Title"
        className="w-full rounded border p-3"
      />

      <textarea
        rows={8}
        value={content}
        onChange={(e) =>
          setContent(
            e.target.value,
          )
        }
        placeholder="Content"
        className="w-full rounded border p-3"
      />

      <button
        disabled={loading}
        className="rounded bg-black px-6 py-3 text-white"
      >
        Publish
      </button>

    </form>
  );
}