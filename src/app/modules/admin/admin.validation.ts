import { z } from 'zod';

// Validation for FacultyName
const NameValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(20, { message: "First name can't have more than 20 characters" })
    .refine(
      (value) => {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        return firstNameStr === value;
      },
      { message: 'First name must be capitalized!' },
    ),
  middleName: z
    .string()
    .trim()
    .max(20, { message: "Middle name can't have more than 20 characters" })
    .optional(),
  lastName: z
    .string()
    .trim()
    .max(20, { message: "Last name can't have more than 20 characters" }),
});

export const AdminValidationSchema = z.object({
  body: z.object({
    password: z
      .string()
      .trim()
      .max(35, { message: "Password can't have more than 35 characters" })
      .optional(),
    admin: z.object({
      designation: z.string().min(1, { message: 'Designation is required' }),
      name: NameValidationSchema,
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
      managementDepartment: z
        .string()
        .min(1, { message: 'Management department is required' }),
    }),
  }),
});

//
//
// below are for update validation

const updateNameValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(20, { message: "First name can't have more than 20 characters" })
    .refine(
      (value) => {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        return firstNameStr === value;
      },
      { message: 'First name must be capitalized!' },
    )
    .optional(), // Make first name optional for updates

  middleName: z
    .string()
    .trim()
    .max(20, { message: "Middle name can't have more than 20 characters" })
    .optional(), // Make middle name optional for updates

  lastName: z
    .string()
    .trim()
    .max(20, { message: "Last name can't have more than 20 characters" })
    .optional(), // Make last name optional for updates
});

export const updateAdminValidationSchema = z.object({
  body: z
    .object({
      designation: z.string().optional(),
      name: updateNameValidationSchema.optional(),
      gender: z.enum(['male', 'female', 'others']).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(), // Optional for update
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      managementDepartment: z.string().optional(),
    })
    .optional(),
});
