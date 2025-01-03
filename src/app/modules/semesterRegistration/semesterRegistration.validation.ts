import { z } from 'zod';

// Zod validation for Semester Registration
export const SemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z
      .string({ required_error: 'AcademicSemester ID is required' })
      .refine((id) => id.match(/^[a-fA-F0-9]{24}$/), {
        message: 'Invalid ObjectId format',
      }),
    status: z.enum(['UPCOMING', 'ONGOING', 'ENDED'], {
      required_error: 'Status is required',
      invalid_type_error: 'Status must be one of UPCOMING, ONGOING, or ENDED',
    }),
    startDate: z
      .string({ required_error: 'Start date is required' })
      .refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
      }),
    endDate: z
      .string({ required_error: 'End date is required' })
      .refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
      }),
    minCredit: z.number({ required_error: 'Minimum credit is required' }).int({
      message: 'Minimum credit must be an integer',
    }),
    maxCredit: z.number({ required_error: 'Maximum credit is required' }).int({
      message: 'Maximum credit must be an integer',
    }),
  }),
});
