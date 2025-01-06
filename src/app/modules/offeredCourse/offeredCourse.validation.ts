import { z } from 'zod';

export const OfferedCourseValidationSchema = z.object({
  body: z.object({
    semesterRegistration: z
      .string({ required_error: 'Semester Registration ID is required' })
      .refine((id) => id.match(/^[a-fA-F0-9]{24}$/), {
        message: 'Invalid ObjectId format for Semester Registration',
      }),
    academicFaculty: z
      .string({ required_error: 'Academic Faculty ID is required' })
      .refine((id) => id.match(/^[a-fA-F0-9]{24}$/), {
        message: 'Invalid ObjectId format for Academic Faculty',
      }),
    academicDepartment: z
      .string({ required_error: 'Academic Department ID is required' })
      .refine((id) => id.match(/^[a-fA-F0-9]{24}$/), {
        message: 'Invalid ObjectId format for Academic Department',
      }),
    course: z
      .string({ required_error: 'Course ID is required' })
      .refine((id) => id.match(/^[a-fA-F0-9]{24}$/), {
        message: 'Invalid ObjectId format for Course',
      }),
    faculty: z
      .string({ required_error: 'Faculty ID is required' })
      .refine((id) => id.match(/^[a-fA-F0-9]{24}$/), {
        message: 'Invalid ObjectId format for Faculty',
      }),
    maxCapacity: z
      .number({ required_error: 'Max Capacity is required' })
      .min(1, { message: 'Max Capacity must be at least 1' }),
    section: z.number({ required_error: 'Section is required' }),
    days: z
      .array(
        z.enum(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], {
          required_error: 'Days are required',
        }),
      )
      .nonempty({ message: 'At least one day must be selected' }),
    startTime: z
      .string({ required_error: 'Start Time is required' })
      .refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
        message: 'Start Time must be in HH:mm format',
      }),
    endTime: z
      .string({ required_error: 'End Time is required' })
      .refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
        message: 'End Time must be in HH:mm format',
      }),
  }),
});

//updateOfferedCourse
//
// this is for update validation

export const updateOfferedCourseValidationSchema = z.object({
  body: z.object({
    faculty: z
      .string({ required_error: 'Faculty ID is required' })
      .refine((id) => id.match(/^[a-fA-F0-9]{24}$/), {
        message: 'Invalid ObjectId format for Faculty',
      })
      .optional(),
    section: z.number().optional(),
    days: z.enum(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).optional(),
    startTime: z
      .string({ required_error: 'Start Time is required' })
      .refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
        message: 'Start Time must be in HH:mm format',
      })
      .optional(),
    endTime: z
      .string({ required_error: 'End Time is required' })
      .refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
        message: 'End Time must be in HH:mm format',
      })
      .optional(),
  }),
});
