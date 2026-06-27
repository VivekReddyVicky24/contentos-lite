import { z } from "zod";

export const brandSchema = z.object({
  company_name: z.string().min(2, "Company name is required"),

  brand_voice: z.string().min(5, "Brand voice is required"),

  target_audience: z
    .string()
    .min(5, "Target audience is required"),

  content_goals: z
    .string()
    .min(5, "Content goals are required"),

  preferred_platforms: z
    .array(z.string())
    .min(1, "Select at least one platform"),
});

export type BrandFormValues = z.infer<typeof brandSchema>;