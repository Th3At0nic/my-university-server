import { z } from 'zod';

const userValidationSchema = z.object({
  id: z
    .string()
    .trim()
    .max(30, { message: "ID can't have more than 30 characters" }),
  password: z
    .string()
    .trim()
    .min(8, { message: 'Password must be at least 8 characters long' }),
  needsPasswordChange: z.boolean().default(true).optional(),
  role: z.enum(['admin', 'student', 'faculty']),
  status: z.enum(['in-progress', 'blocked']).default('in-progress'),
  isDeleted: z.boolean().default(false).optional(),
});

export default userValidationSchema;
