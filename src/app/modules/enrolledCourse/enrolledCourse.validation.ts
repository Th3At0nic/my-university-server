import { Types } from 'mongoose';
import { z } from 'zod';

export const CreateEnrolledCourseValidationSchema = z.object({
  body: z.object({
    offeredCourse: z.string().refine((value) => Types.ObjectId.isValid(value), {
      message: 'Invalid ObjectId for offeredCourse',
    }),
  }),
});

export const UpdateCourseMarksValidationSchema = z.object({
  body: z.object({
    semesterRegistration: z.string(),
    offeredCourse: z.string(),
    student: z.string(),
    courseMarks: z.object({
      classTest1: z.number().optional(),
      midTerm: z.number().optional(),
      classTest2: z.number().optional(),
      finalTerm: z.number().optional(),
    }),
  }),
});
