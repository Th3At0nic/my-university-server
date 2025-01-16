import { z } from 'zod';

export const loginUserValidationSchema = z.object({
  body: z.object({
    id: z.string().min(1, { message: 'User ID is required.' }),
    password: z.string().min(1, { message: 'Password is required.' }),
  }),
});

export const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, { message: 'Old Password is required.' }),
    newPassword: z.string().min(1, { message: 'New Password is required.' }),
  }),
});

export const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'Refresh token is required!' }),
  }),
});
