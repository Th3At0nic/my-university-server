import { z } from 'zod';

export const AcademicFacultyValidation = z.object({
  body: z.object({ name: z.string() }),
});
