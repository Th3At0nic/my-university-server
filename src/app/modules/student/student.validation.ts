import { z } from 'zod';
import { SemesterModel } from '../academicSemester/academicSemester.model';
import { DepartmentModel } from '../academicDepartment/academicDepartment.model';

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
export const studentValidationSchema = z.object({
  body: z.object({
    password: z
      .string()
      .trim()
      .max(35, { message: "Password can't have more than 35 characters" })
      .optional(),
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
      academicDepartment: z
        .string()
        .regex(objectIdRegex, { message: 'Invalid ObjectId format' }), // Regex validation
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
    }),
  }),
});

/*
the below validation schema is for update 
*/

const updateUserNameValidationSchema = z.object({
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
    .optional(),
  middleName: z
    .string()
    .trim()
    .max(20, { message: "Middle name can't have more than 20 characters" })
    .optional(),
  lastName: z
    .string()
    .trim()
    .max(20, { message: "Last name can't have more than 20 characters" })
    .optional(),
});

// Validation for Guardian
const updateGuardianValidationSchema = z.object({
  fatherName: z
    .string()
    .max(50, { message: "Name can't have more than 50 characters" })
    .optional(),
  fatherOccupation: z.string().optional(),
  fatherContact: z.string().optional(),
  motherName: z
    .string()
    .max(50, { message: "Name can't have more than 50 characters" })
    .optional(),
  motherOccupation: z.string().optional(),
  motherContact: z.string().optional(),
});

// Validation for LocalGuardian
const updateLocalGuardianValidationSchema = z.object({
  name: z
    .string()
    .max(50, { message: "Name can't have more than 50 characters" })
    .optional(),
  occupation: z.string().optional(),
  contactNo: z.string().optional(),
  address: z.string().optional(),
});

// Validation for Student
export const updateStudentValidationSchema = z.object({
  body: z.object({
    password: z
      .string()
      .trim()
      .max(35, { message: "Password can't have more than 35 characters" })
      .optional(),
    student: z.object({
      name: updateUserNameValidationSchema,
      gender: z
        .enum(['male', 'female', 'others'], {
          errorMap: () => ({
            message: "Gender can be only 'male', 'female' or 'others'",
          }),
        })
        .optional(),
      dateOfBirth: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
          message: 'Invalid date format',
        })
        .transform((val) => new Date(val))
        .optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      guardian: updateGuardianValidationSchema,
      localGuardian: updateLocalGuardianValidationSchema.optional(),
      academicDepartment: z
        .string()
        .regex(objectIdRegex, { message: 'Invalid ObjectId format' }) // Regex validation
        .refine(
          async (id) => {
            // Check in the database if the semester exists
            const exists = await DepartmentModel.exists({ _id: id });
            return !!exists; // Return true if found, false otherwise
          },
          { message: 'Department ID does not exist in the database' }, // Error message for non-existent ID
        )
        .optional(),
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
        )
        .optional(),
      // profileImg: z.string().optional(),
    }),
  }),
});
