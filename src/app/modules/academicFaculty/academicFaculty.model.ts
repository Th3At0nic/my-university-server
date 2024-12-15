import { model, Schema } from 'mongoose';
import { TAcademicFaculty } from './academicFaculty.interface';

const AcademicFacultySchema = new Schema<TAcademicFaculty>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export const AcademicFacultyModel = model<TAcademicFaculty>(
  'Academic_Faculty',
  AcademicFacultySchema,
);
