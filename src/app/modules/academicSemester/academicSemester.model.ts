import { model, Schema } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import {
  academicSemesterCode,
  academicSemesterName,
  months,
} from './academicSemester.constants';

export const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: { type: String, enum: academicSemesterName, required: true },
    code: { type: String, enum: academicSemesterCode, required: true },
    year: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => /^\d{4}$/.test(value), // Validates a 4-digit year
        message: 'Year must be a 4-digit number',
      },
    },
    startMonth: {
      type: String,
      enum: months,
      required: true,
    },
    endMonth: {
      type: String,
      enum: months,
      required: true,
    },
  },
  { timestamps: true },
);

academicSemesterSchema.pre('save', async function (next) {
  const isSemesterExists = await SemesterModel.findOne({
    name: this.name,
    year: this.year,
  });
  if (isSemesterExists) {
    throw new Error(`The ${this.name} semester of the year is already exists!`);
  }
  next();
});

export const SemesterModel = model<TAcademicSemester>(
  'Academic_Semester',
  academicSemesterSchema,
);
