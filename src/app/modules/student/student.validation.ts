import { z } from 'zod';

// Validation for UserName
const userNameValidationSchema = z.object({
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

// Validation for Guardian
const guardianValidationSchema = z.object({
  fatherName: z
    .string()
    .max(50, { message: "Name can't have more than 50 characters" }),
  fatherOccupation: z.string(),
  fatherContact: z.string(),
  motherName: z
    .string()
    .max(50, { message: "Name can't have more than 50 characters" }),
  motherOccupation: z.string(),
  motherContact: z.string(),
});

// Validation for LocalGuardian
const localGuardianValidationSchema = z.object({
  name: z
    .string()
    .max(50, { message: "Name can't have more than 50 characters" }),
  occupation: z.string(),
  contactNo: z.string(),
  address: z.string(),
});

// Validation for Student
const studentValidationSchema = z.object({
  id: z
    .string()
    .trim()
    .max(15, { message: "ID can't have more than 15 characters" }),
  password: z
    .string()
    .trim()
    .max(35, { message: "Password can't have more than 35 characters" }),
  name: userNameValidationSchema,
  gender: z.enum(['male', 'female', 'others'], {
    errorMap: () => ({
      message: "Gender can be only 'male', 'female' or 'others'",
    }),
  }),
  dateOfBirth: z.string(),
  email: z.string().email(),
  contactNo: z.string(),
  emergencyContactNo: z.string(),
  bloodGroup: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional(),
  presentAddress: z.string(),
  permanentAddress: z.string(),
  guardian: guardianValidationSchema,
  localGuardian: localGuardianValidationSchema.optional(),
  profileImg: z.string().optional(),
  isActive: z.enum(['active', 'blocked']).default('active'),
  isDeleted: z.boolean().default(false),
});

export default studentValidationSchema;
