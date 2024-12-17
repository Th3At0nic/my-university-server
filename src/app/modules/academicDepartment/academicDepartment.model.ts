import { model, Schema } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: { type: String, required: true },
    academicFaculty: { type: Schema.Types.ObjectId, ref: 'Academic_Faculty' },
  },
  { timestamps: true },
);

export const DepartmentModel = model<TAcademicDepartment>(
  'Academic_Department',
  academicDepartmentSchema,
);
