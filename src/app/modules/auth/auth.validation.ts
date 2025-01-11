import { z } from 'zod';

export const loginUserValidationSchema = z.object({
  body: z.object({
    id: z.string().min(1, { message: 'User ID is required.' }),
    password: z.string().min(1, { message: 'Password is required.' }),
  }),
});
