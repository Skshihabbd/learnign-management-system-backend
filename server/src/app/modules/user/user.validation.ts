import { z } from "zod";

export const createUserTransactionSchema = z.object({
  name: z
    .string({
      message: "Name is required",
    })
    .min(3, {
      message: "Name must be at least 3 characters long",
    })
    .max(50, {
      message: "Name cannot exceed 50 characters",
    }),

  email: z
    .string({
      message: "Email is required",
    })
    .email({
      message: "Please provide a valid email address",
    }),

  password: z
    .string({
      message: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters long",
    }),

  simulateRollback: z
    .boolean()
    .optional()
    .default(false),
});