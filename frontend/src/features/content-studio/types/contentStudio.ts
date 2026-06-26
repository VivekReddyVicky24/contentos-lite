export interface AgentResponse {
  topic: string;

  research: string;

  plan: Record<string, unknown>;

  seo: Record<string, unknown>;

  draft: Record<string, unknown>;

  edited_draft: Record<string, unknown>;

  approval_status: string;

  reviewer_notes: string;

  current_agent: string;

  execution_log: string[];

  failed: boolean;

  error_message: string;
}