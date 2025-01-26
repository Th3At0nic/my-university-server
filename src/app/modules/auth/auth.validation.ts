import { z } from 'zod';

const loginUserValidationSchema = z.object({
  body: z.object({
    id: z.string().min(1, { message: 'User ID is required.' }),
    password: z.string().min(1, { message: 'Password is required.' }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, { message: 'Old Password is required.' }),
    newPassword: z.string().min(1, { message: 'New Password is required.' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'Refresh token is required!' }),
  }),
});

const forgetPasswordValidation = z.object({
  body: z.object({
    id: z.string().min(1, { message: 'User ID is required.' }),
  }),
});

const resetPasswordValidation = z.object({
  body: z.object({
    id: z.string().min(1, { message: 'User ID is required.' }),
    newPassword: z.string().min(1, { message: 'New Password is required.' }),
  }),
});

export const AuthValidationSchemas = {
  loginUserValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidation,
  resetPasswordValidation,
};
