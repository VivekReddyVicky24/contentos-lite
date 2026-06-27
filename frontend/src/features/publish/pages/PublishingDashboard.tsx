import {
  useEffect,
  useState,
} from "react";

import {
  useWorkspace,
} from "@/features/workspace/context/WorkspaceContext";

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


  async function refresh() {

    if (!workspace) {
      return;
    }

    const data =
      await getPublications(
        workspace.id,
      );

    setPublications(data);
  }


  useEffect(() => {

    void refresh();

  }, [workspace]);


  async function handlePublish(
    platform: string,
    title: string,
    content: string,
  ) {

    if (!workspace) {
      return;
    }

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
  }


  return (

    <div className="mx-auto max-w-7xl p-8">

      <h1 className="mb-8 text-4xl font-bold">
        Publishing Center
      </h1>

      <PublishForm
        onPublish={
          handlePublish
        }
      />

      <div className="mt-8 space-y-4">

        {publications.map(
          (publication) => (

            <div
              key={publication.id}
              className="rounded-xl border p-6"
            >

              <h2 className="text-xl font-bold">
                {publication.title}
              </h2>

              <p>
                Platform:
                {" "}
                {publication.platform}
              </p>

              <p>
                Status:
                {" "}
                {publication.status}
              </p>

            </div>

          ),
        )}

      </div>

    </div>
  );
}