import { z } from 'zod';
import {
  academicSemesterCode,
  academicSemesterName,
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
    year: z.preprocess(
      (val) => (typeof val === 'string' ? new Date(val) : val), // Convert string input to Date
      z.date({
        errorMap: () => ({ message: 'Year must be a valid date.' }),
      }),
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
      .preprocess(
        (val) => (typeof val === 'string' ? new Date(val) : val), // Convert string input to Date
        z.date({
          errorMap: () => ({ message: 'Year must be a valid date.' }),
        }),
      )
      .optional(),
    startMonth: z.enum(months as [string, ...string[]]).optional(),
    endMonth: z.enum(months as [string, ...string[]]).optional(),
  }),
});
