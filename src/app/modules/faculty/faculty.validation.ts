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

// Define the Zod schema for the Faculty model
export const FacultyValidationSchema = z.object({
  body: z.object({
    password: z
      .string()
      .trim()
      .max(35, { message: "Password can't have more than 35 characters" })
      .optional(),
    faculty: z.object({
      designation: z.string({
        required_error: 'Designation is required',
      }),
      name: NameValidationSchema,
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
      email: z.string().email(),
      contactNo: z.string({
        required_error: 'Contact number is required',
      }),
      emergencyContactNo: z.string({
        required_error: 'Emergency contact number is required',
      }),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string({
        required_error: 'Present address is required',
      }),
      permanentAddress: z.string({
        required_error: 'Permanent address is required',
      }),
      // profileImage: z.string({
      //   required_error: 'Profile image is required',
      // }),
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

//
//
//
//below validation schemas are for update
// Validation for FacultyName (unchanged from the original)
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

// Define the Zod schema for the Faculty update
export const updateFacultyValidationSchema = z.object({
  body: z.object({
    password: z
      .string()
      .trim()
      .max(35, { message: "Password can't have more than 35 characters" })
      .optional(), // Password is optional for update
    faculty: z.object({
      designation: z.string().optional(), // Optional for update
      name: updateNameValidationSchema.optional(), // Optional for update
      gender: z.enum(['male', 'female', 'others']).optional(), // Optional for update
      dateOfBirth: z
        .string()
        .datetime({ offset: true })
        .optional()
        .or(z.date())
        .optional(), // Optional for update
      contactNo: z.string().optional(), // Optional for update
      emergencyContactNo: z.string().optional(), // Optional for update
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(), // Optional for update
      presentAddress: z.string().optional(), // Optional for update
      permanentAddress: z.string().optional(), // Optional for update
      // profileImage: z.string().optional(), // Optional for update
      academicFaculty: z.string().optional(), // Optional for update
      academicDepartment: z.string().optional(), // Optional for update
    }),
  }),
});
