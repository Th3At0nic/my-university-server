import { z } from 'zod';
import { userStatus } from './user.constant';

export const userValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: 'Password must be string' })
    .trim()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .optional(),
});

export const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(userStatus),
  }),
});
