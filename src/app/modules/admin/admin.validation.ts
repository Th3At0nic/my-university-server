import { z } from 'zod';

export const AdminValidationSchema = z.object({
  body: z.object({
    password: z
      .string()
      .trim()
      .max(35, { message: "Password can't have more than 35 characters" }),
    admin: z.object({
      designation: z.string().min(1, { message: 'Designation is required' }),
      name: z.string().min(1, { message: 'Name is required' }),
      gender: z.enum(['male', 'female', 'others'], {
        message: 'Gender must be male, female, or others',
      }),
      dateOfBirth: z.string().optional(),
      email: z
        .string()
        .email({ message: 'Invalid email address' })
        .min(1, { message: 'Email is required' }),
      contactNo: z.string().min(1, { message: 'Contact number is required' }),
      emergencyContactNo: z
        .string()
        .min(1, { message: 'Emergency contact number is required' }),
      presentAddress: z
        .string()
        .min(1, { message: 'Present address is required' }),
      permanentAddress: z
        .string()
        .min(1, { message: 'Permanent address is required' }),
      profileImage: z.string().min(1, { message: 'Profile image is required' }),
      managementDepartment: z
        .string()
        .min(1, { message: 'Management department is required' }),
    }),
  }),
});

// export type AdminValidationType = z.infer<typeof AdminValidationSchema>;
