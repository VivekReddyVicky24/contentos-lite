export interface WeeklyPlan {
  week: number;
  topic: string;
  channel: string;
}

export interface Strategy {
  monthly_objectives: string[];
  content_themes: string[];
  recommended_channels: string[];
  weekly_plan: WeeklyPlan[];
  campaign_ideas: string[];
}