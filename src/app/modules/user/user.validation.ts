import { z } from 'zod';

const userValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: 'Password must be string' })
    .trim()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .optional(),
});

export default userValidationSchema;
