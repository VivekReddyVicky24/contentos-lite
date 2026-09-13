import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export interface ApprovedContentItem {
  id: string;
  workspace_id: string;
  title: string;
  topic: string;
  channel: string;
  status: string;
  approval_status?: string;
  content?: {
    title?: string;
    introduction?: string;
    sections?: Array<{
      heading?: string;
      content?: string;
    }>;
    conclusion?: string;
    call_to_action?: string;
  };
  evaluation?: Record<string, unknown>;
  generated_at?: string;
  approved_at?: string;
  reviewer_notes?: string;
}

export async function getContentItems(
  workspaceId: string,
): Promise<ApprovedContentItem[]> {
  const response = await axios.get(
    `${API_URL}/content-items/${workspaceId}`,
  );

  return response.data || [];
}
