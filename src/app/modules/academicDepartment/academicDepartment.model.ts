import { model, Schema } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import { ConflictError } from '../../utils/errors/conflictError';

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
    throw new ConflictError(
      'Duplicate Error! The Department is already exists.',
      [
        {
          path: `${this.name}`,
          message: `${this.name} is already exists in the system`,
        },
      ],
    );
  }
});

export const DepartmentModel = model<TAcademicDepartment>(
  'Academic_Department',
  academicDepartmentSchema,
);
