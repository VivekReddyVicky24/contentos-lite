export interface BrandBrainResponse {
  answer: string;
  sources: string[];
  confidence: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  confidence?: number;
  sources?: string[];
}