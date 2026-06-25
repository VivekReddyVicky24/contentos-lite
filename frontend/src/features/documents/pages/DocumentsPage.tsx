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
        ))}
      </div>
    </div>
  );
}