export interface ContentPlanPost {
  platform: string;
  title: string;
  type: string;
}

export interface ContentPlanWeek {
  week: number;
  posts: ContentPlanPost[];
}

export interface ContentPlan {
  month: string;
  weeks: ContentPlanWeek[];
}