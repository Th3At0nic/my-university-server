import { z } from 'zod';
import { SemesterModel } from '../academicSemester/academicSemester.model';

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

//object id regular expressions
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// Validation for Student
const studentValidationSchema = z.object({
  body: z.object({
    password: z
      .string()
      .trim()
      .max(35, { message: "Password can't have more than 35 characters" }),
    student: z.object({
      name: userNameValidationSchema,
      gender: z.enum(['male', 'female', 'others'], {
        errorMap: () => ({
          message: "Gender can be only 'male', 'female' or 'others'",
        }),
      }),
      dateOfBirth: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
          message: 'Invalid date format',
        })
        .transform((val) => new Date(val)),
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
      admissionSemester: z
        .string()
        .regex(objectIdRegex, { message: 'Invalid ObjectId format' }) // Regex validation
        .refine(
          async (id) => {
            // Check in the database if the semester exists
            const exists = await SemesterModel.exists({ _id: id });
            return !!exists; // Return true if found, false otherwise
          },
          { message: 'Semester ID does not exist in the database' }, // Error message for non-existent ID
        ),
      profileImg: z.string().optional(),
    }),
  }),
});

export default studentValidationSchema;
