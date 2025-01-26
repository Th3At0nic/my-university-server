import { model, Schema } from 'mongoose';
import { TAcademicFaculty } from './academicFaculty.interface';
import { ConflictError } from '../../errors/ConflictError';

const AcademicFacultySchema = new Schema<TAcademicFaculty>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

AcademicFacultySchema.pre('save', async function () {
  const isFacultyExists = await AcademicFacultyModel.findOne({
    name: this.name,
  });

  if (isFacultyExists) {
    throw new ConflictError('This Faculty is already exists!', [
      {
        path: `${this.name}`,
        message: `${this.name} already exists. Duplicate entries are not allowed.`,
      },
    ]);
  }
});

export const AcademicFacultyModel = model<TAcademicFaculty>(
  'Academic_Faculty',
  AcademicFacultySchema,
);
