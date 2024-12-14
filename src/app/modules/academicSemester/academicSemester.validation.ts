import { z } from 'zod';
import {
  academicSemesterCode,
  academicSemesterName,
  currentYear,
  months,
} from './academicSemester.constants';

export const createAcademicSemesterValidation = z.object({
  body: z.object({
    name: z.enum(academicSemesterName as [string, ...string[]], {
      errorMap: () => ({
        message: "Name must be one of 'Autumn', 'Summer', or 'Fall'.",
      }),
    }),
    code: z.enum(academicSemesterCode as [string, ...string[]], {
      errorMap: () => ({ message: "Code must be one of '01', '02', or '03'." }),
    }),
    year: z
      .string()
      .regex(/^\d{4}$/, { message: 'Year must be a 4-digit number' }) // Ensure it's a 4-digit year
      .refine(
        (year) => parseInt(year) >= currentYear, // Ensure it's not older than the current year
        { message: `Year must not be older than ${currentYear}` },
      ),
    startMonth: z.enum(months as [string, ...string[]]),
    endMonth: z.enum(months as [string, ...string[]]),
  }),
});

export const updateAcademicSemesterValidation = z.object({
  body: z.object({
    name: z
      .enum(academicSemesterName as [string, ...string[]], {
        errorMap: () => ({
          message: "Name must be one of 'Autumn', 'Summer', or 'Fall'.",
        }),
      })
      .optional(),
    code: z
      .enum(academicSemesterCode as [string, ...string[]], {
        errorMap: () => ({
          message: "Code must be one of '01', '02', or '03'.",
        }),
      })
      .optional(),
    year: z
      .string()
      .regex(/^\d{4}$/, { message: 'Year must be a 4-digit number' }) // Ensure it's a 4-digit year
      .optional(),
    startMonth: z.enum(months as [string, ...string[]]).optional(),
    endMonth: z.enum(months as [string, ...string[]]).optional(),
  }),
});
