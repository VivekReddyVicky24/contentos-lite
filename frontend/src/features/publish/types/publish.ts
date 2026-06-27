export interface PublishRequest {

  workspace_id: string;

  platform:
    | "medium"
    | "wordpress"
    | "ghost";

  title: string;

  content: string;
}