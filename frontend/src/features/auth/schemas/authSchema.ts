import { z } from "zod";

export const signupSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name is required"),

  email: z
    .email("Invalid email address"),

  password: z
    .string()
    .min(
      6,
      "Password must be at least 6 characters"
    ),
});

export type SignupFormData =
  z.infer<typeof signupSchema>;