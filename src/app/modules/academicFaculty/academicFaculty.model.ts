import { model, Schema } from 'mongoose';
import { TAcademicFaculty } from './academicFaculty.interface';

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
    throw new Error('This Faculty is already exists!');
  }
});

export const AcademicFacultyModel = model<TAcademicFaculty>(
  'Academic_Faculty',
  AcademicFacultySchema,
);
