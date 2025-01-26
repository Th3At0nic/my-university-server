import { z } from 'zod';
import { ValidationError } from '../../errors/ValidationError';

export const OfferedCourseValidationSchema = z.object({
  body: z
    .object({
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
    })
    .refine(
      (data) => {
        const [startHour, startMinute] = (data.startTime as string)
          .split(':')
          .map(Number);
        const [endHour, endMinute] = (data.endTime as string)
          .split(':')
          .map(Number);
        return (
          endHour > startHour ||
          (endHour === startHour && endMinute > startMinute)
        );
      },
      {
        path: ['startTime'], // Points to the specific field causing the issue
        message: 'Start Time must be earlier than End Time',
      },
    ),
});

//updateOfferedCourse
//
// this is for update validation

export const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: z
        .string({ required_error: 'Faculty ID is required' })
        .refine((id) => id.match(/^[a-fA-F0-9]{24}$/), {
          message: 'Invalid ObjectId format for Faculty',
        })
        .optional(),
      section: z.number().optional(),
      days: z
        .array(
          z.enum(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], {
            required_error: 'Days are required',
          }),
        )
        .nonempty({ message: 'At least one day must be selected' })
        .optional(),
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
    })
    .refine(
      (data) => {
        const { startTime, endTime } = data;

        // Check if only one of the fields is missing
        if ((startTime && !endTime) || (!startTime && endTime)) {
          throw new ValidationError(
            'Both Start Time and End Time must be provided',
            [
              {
                path: startTime ? 'endTime' : 'startTime', // Dynamically set the missing field
                message: startTime
                  ? 'End Time must be provided when Start Time is given'
                  : 'Start Time must be provided when End Time is given',
              },
            ],
          );
        }

        // Check if both fields are provided and validate the time order
        if (startTime && endTime) {
          const [startHour, startMinute] = startTime.split(':').map(Number);
          const [endHour, endMinute] = endTime.split(':').map(Number);

          if (
            endHour > startHour ||
            (endHour === startHour && endMinute > startMinute)
          ) {
            return true; // Validation passes
          } else {
            throw new ValidationError('Invalid time range', [
              {
                path: 'startTime',
                message: 'Start Time must be earlier than End Time',
              },
              {
                path: 'endTime',
                message: 'End Time must be later than Start Time',
              },
            ]);
          }
        }

        return true; // Pass validation if both fields are absent (optional case)
      },
      {
        path: ['startTime', 'endTime'], // Applicable fields for validation error
        message: 'Invalid time range or missing fields',
      },
    ),
});
