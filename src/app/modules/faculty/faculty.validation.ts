import { z } from 'zod';

// Define the Zod schema for the Faculty model
export const FacultyValidationSchema = z.object({
  body: z.object({
    password: z
      .string()
      .trim()
      .max(35, { message: "Password can't have more than 35 characters" }),
    faculty: z.object({
      designation: z.string({
        required_error: 'Designation is required',
      }),
      name: z.string({
        required_error: 'Name is required',
      }),
      gender: z.enum(['male', 'female', 'others'], {
        required_error: 'Gender is required',
        invalid_type_error:
          "Gender can only be one of 'male', 'female', or 'others'",
      }),
      dateOfBirth: z
        .string()
        .datetime({ offset: true })
        .optional()
        .or(z.date())
        .optional(),
      contactNo: z.string({
        required_error: 'Contact number is required',
      }),
      emergencyContactNo: z.string({
        required_error: 'Emergency contact number is required',
      }),
      presentAddress: z.string({
        required_error: 'Present address is required',
      }),
      permanentAddress: z.string({
        required_error: 'Permanent address is required',
      }),
      profileImage: z.string({
        required_error: 'Profile image is required',
      }),
      academicFaculty: z.string({
        required_error: 'Academic faculty ObjectId is required',
      }),
      academicDepartment: z.string({
        required_error: 'Academic department ObjectId is required',
      }),
    }),
  }),
});

// Export a type based on the validation schema
// export type FacultyValidationType = z.infer<typeof FacultyValidationSchema>;
