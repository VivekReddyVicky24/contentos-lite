import {
  useEffect,
  useState,
} from "react";

import {
  useWorkspace,
} from "@/features/workspace/context/WorkspaceContext";

import {
  uploadDocument,
  getDocuments,
} from "../services/documentService";

function statusColor(
  status: string,
) {
  switch (status) {
    case "ready":
      return "bg-green-500";
    case "embedding":
      return "bg-blue-500";
    case "chunking":
      return "bg-yellow-500";
    case "extracting":
      return "bg-orange-500";
    default:
      return "bg-red-500";
  }
}

export default function DocumentsPage() {
  const { workspace } =
    useWorkspace();

  const [file, setFile] =
    useState<File | null>(null);

  const [documents, setDocuments] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  async function loadDocuments() {
    if (!workspace) return;

    const docs =
      await getDocuments(
        workspace.id
      );

    setDocuments(docs);
  }

  useEffect(() => {
    loadDocuments();
  }, [workspace]);

  async function handleUpload() {
    if (!file || !workspace) return;

    try {
      setLoading(true);

      await uploadDocument(
        file,
        workspace.id
      );

      await loadDocuments();

      setFile(null);

      alert(
        "Upload successful"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">
        Documents
      </h1>

      <div>
        <input
          type="file"
          onChange={(e) =>
            setFile(
              e.target.files?.[0] ??
                null
            )
          }
        />
        <button
          onClick={handleUpload}
        >
          {loading
            ? "Uploading..."
            : "Upload"}
        </button>
      </div>

      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="border rounded p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3>
                  {doc.file_name}
                </h3>
                <p>
                  {doc.file_type}
                </p>
                <p>
                  {(
                    doc.file_size /
                    1024
                  ).toFixed(2)}
                  KB
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs text-white ${statusColor(
                  doc.processing_status,
                )}`}
              >
                {doc.processing_status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}