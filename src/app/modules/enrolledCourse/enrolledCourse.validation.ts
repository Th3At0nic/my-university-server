import { Types } from 'mongoose';
import { z } from 'zod';

export const CreateEnrolledCourseValidationSchema = z.object({
  body: z.object({
    offeredCourse: z.string().refine((value) => Types.ObjectId.isValid(value), {
      message: 'Invalid ObjectId for offeredCourse',
    }),
  }),
});
