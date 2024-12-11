import { z } from 'zod';

const monthsEnum = z.enum([
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
]);

export const createAcademicSemesterValidation = z.object({
  body: z.object({
    name: z.enum(['Autumn', 'Summer', 'Fall'], {
      errorMap: () => ({
        message: "Name must be one of 'Autumn', 'Summer', or 'Fall'.",
      }),
    }),
    code: z.enum(['01', '02', '03'], {
      errorMap: () => ({ message: "Code must be one of '01', '02', or '03'." }),
    }),
    year: z.preprocess(
      (val) => (typeof val === 'string' ? new Date(val) : val), // Convert string input to Date
      z.date({
        errorMap: () => ({ message: 'Year must be a valid date.' }),
      }),
    ),
    startMonth: monthsEnum,
    endMonth: monthsEnum,
  }),
});
