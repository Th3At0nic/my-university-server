import { model, Schema } from 'mongoose';
import { TSemester } from './academicSemester.interface';

export const semesterSchema = new Schema<TSemester>(
  {
    _id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    year: { type: Date, required: true },
    code: { type: Number, required: true },
    startMonth: {
      type: String,
      enum: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      required: true,
    },
    endMonth: {
      type: String,
      enum: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      required: true,
    },
  },
  { timestamps: true },
);

export const SemesterModel = model<TSemester>('Semester', semesterSchema);
