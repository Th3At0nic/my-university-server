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
      classTest1: z.number().min(0).max(10).optional(),
      midTerm: z.number().min(0).max(30).optional(),
      classTest2: z.number().min(0).max(10).optional(),
      finalTerm: z.number().min(0).max(50).optional(),
    }),
  }),
});
