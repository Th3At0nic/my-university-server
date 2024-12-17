import { z } from 'zod';

const objectIdRegex = /^[a-f\d]{24}$/i;

export const AcademicDepartmentValidation = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    academicFaculty: z.string().regex(objectIdRegex, {
      message: 'Invalid ObjectId format for academicFaculty',
    }),
  }),
});

export const UpdateAcademicDepartmentValidation = z.object({
  body: z
    .object({
      name: z
        .string({
          required_error: 'Name is required',
        })
        .optional(),
      academicFaculty: z.string().regex(objectIdRegex, {
        message: 'Invalid ObjectId format for academicFaculty',
      }),
    })
    .optional(),
});
