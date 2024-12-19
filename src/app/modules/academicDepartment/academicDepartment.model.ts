import { model, Schema } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: { type: String, required: true, unique: true },
    academicFaculty: { type: Schema.Types.ObjectId, ref: 'Academic_Faculty' },
  },
  { timestamps: true },
);

academicDepartmentSchema.pre('save', async function () {
  const isDepartmentExists = await DepartmentModel.findOne({ name: this.name });

  if (isDepartmentExists) {
    throw new Error('This department is already exists!');
  }
});

export const DepartmentModel = model<TAcademicDepartment>(
  'Academic_Department',
  academicDepartmentSchema,
);
