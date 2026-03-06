import { z } from "zod";

export const completeProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(
      /^[\p{L}\p{M} '-]+$/u,
      "Name can only contain letters, spaces, hyphens, and apostrophes",
    ),
});
