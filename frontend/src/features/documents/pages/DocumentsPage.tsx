import {
  FileText,
  Trash2,
  UploadCloud,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import {
  useWorkspace,
} from "@/features/workspace/context";

import {
  deleteDocument,
  getDocuments,
  uploadDocument,
} from "../services/documentService";

interface DocumentItem {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  processing_status: string;
  storage_path: string;
}

function statusClass(status: string) {
  switch (status) {
    case "ready":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "embedding":
      return "bg-sky-50 text-sky-700 ring-sky-200";
    case "chunking":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "extracting":
      return "bg-orange-50 text-orange-700 ring-orange-200";
    default:
      return "bg-rose-50 text-rose-700 ring-rose-200";
  }
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function DocumentsPage() {
  const { workspace } =
    useWorkspace();

  const inputRef =
    useRef<HTMLInputElement>(null);

  const [file, setFile] =
    useState<File | null>(null);

  const [documents, setDocuments] =
    useState<DocumentItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const loadDocuments =
    useCallback(async () => {
      if (!workspace) return;

      setLoading(true);

      try {
        const docs =
          await getDocuments(
            workspace.id,
          );

        setDocuments(docs);
      } catch (error) {
        console.error(error);
        toast.error(
          "Could not load documents.",
        );
      } finally {
        setLoading(false);
      }
    }, [workspace]);

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        void loadDocuments();
      }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadDocuments]);

  async function handleUpload() {
    if (!file || !workspace) return;

    try {
      setUploading(true);

      await uploadDocument(
        file,
        workspace.id,
      );

      await loadDocuments();
      setFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      toast.success(
        "Document uploaded.",
      );
    } catch (error) {
      console.error(error);
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(
    document: DocumentItem,
  ) {
    try {
      setDeletingId(document.id);

      await deleteDocument(
        document.id,
        document.storage_path,
      );

      setDocuments((current) =>
        current.filter(
          (item) =>
            item.id !== document.id,
        ),
      );

      toast.success(
        "Document deleted.",
      );
    } catch (error) {
      console.error(error);
      toast.error("Delete failed.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Brand Memory
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Documents
        </h1>
        <p className="mt-2 text-slate-500">
          Upload PDFs, text files, and brand docs for retrieval grounded content.
        </p>
      </div>

      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <label className="flex min-w-0 flex-1 items-center gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-700">
              <UploadCloud className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-900">
                {file
                  ? file.name
                  : "Choose a document"}
              </p>
              <p className="text-sm text-slate-500">
                PDF, TXT, DOC, or DOCX source files.
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              className="sr-only"
              accept=".pdf,.txt,.doc,.docx,.docx"
              onChange={(e) =>
                setFile(
                  e.target.files?.[0] ??
                    null,
                )
              }
            />
          </label>

          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || uploading}
            className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {uploading
              ? "Uploading..."
              : "Upload"}
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">
            Loading documents...
          </div>
        ) : documents.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">
            No documents uploaded yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-600">
                    <FileText className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-slate-950">
                      {doc.file_name}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {doc.file_type || "Unknown type"} · {formatSize(doc.file_size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${statusClass(
                      doc.processing_status,
                    )}`}
                  >
                    {doc.processing_status}
                  </span>

                  <button
                    type="button"
                    aria-label={`Delete ${doc.file_name}`}
                    onClick={() =>
                      void handleDelete(doc)
                    }
                    disabled={
                      deletingId === doc.id
                    }
                    className="inline-grid size-9 place-items-center rounded-md border border-slate-200 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
