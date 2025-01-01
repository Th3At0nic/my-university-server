import { z } from 'zod';

// Zod validation for PreRequisiteCourses
const PreRequisiteCoursesValidationSchema = z.object({
  course: z.string().optional(), // Assuming this is an ObjectId stored as a string
  isDeleted: z.boolean().optional(),
});

// Zod validation for Course
export const CourseValidationSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(1, { message: 'Title is required' })
      .max(255, { message: "Title can't exceed 255 characters" }),
    prefix: z
      .string()
      .trim()
      .min(1, { message: 'Prefix is required' })
      .max(50, { message: "Prefix can't exceed 50 characters" }),
    code: z
      .number({ required_error: 'Code is required' })
      .int({ message: 'Code must be an integer' }),
    credits: z
      .number({ required_error: 'Credits are required' })
      .int({ message: 'Credits must be an integer' }),
    preRequisiteCourses: z
      .array(PreRequisiteCoursesValidationSchema)
      .optional(),
  }),
});

export const updateCourseValidation = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(1, { message: 'Title is required' })
      .max(255, { message: "Title can't exceed 255 characters" })
      .optional(),
    prefix: z
      .string()
      .trim()
      .min(1, { message: 'Prefix is required' })
      .max(50, { message: "Prefix can't exceed 50 characters" })
      .optional(),
    code: z
      .number({ required_error: 'Code is required' })
      .int({ message: 'Code must be an integer' })
      .optional(),
    credits: z
      .number({ required_error: 'Credits are required' })
      .int({ message: 'Credits must be an integer' })
      .optional(),
    preRequisiteCourses: z
      .array(PreRequisiteCoursesValidationSchema)
      .optional(),
  }),
});

export const courseFacultyValidationSchema = z.object({
  body: z.object({
    faculties: z.array(
      z.string().refine((value) => /^[0-9a-fA-F]{24}$/.test(value), {
        message: 'Invalid ObjectId for faculty',
      }),
    ),
  }),
});
