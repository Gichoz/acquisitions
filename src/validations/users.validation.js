import { z } from 'zod';

export const userIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID must be a valid numeric string')
    .transform(Number)
    .refine(val => val > 0, 'ID must be a positive integer'),
});

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(255)
      .trim()
      .optional(),
    email: z
      .string()
      .email('Invalid email address')
      .max(255)
      .toLowerCase()
      .trim()
      .optional(),
    role: z.enum(['user', 'admin']).optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });
