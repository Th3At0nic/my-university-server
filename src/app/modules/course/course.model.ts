/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { model, Query, Schema } from 'mongoose';
import {
  TCourse,
  TCourseFaculty,
  TPreRequisiteCourses,
} from './course.interface';

const preRequisiteCourses = new Schema<TPreRequisiteCourses>({
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  isDeleted: { type: Boolean },
});

const courseSchema = new Schema<TCourse>({
  title: { type: String, unique: true, required: true, trim: true },
  prefix: { type: String, trim: true, required: true },
  code: { type: Number, trim: true, required: true },
  credits: { type: Number, trim: true, required: true },
  isDeleted: { type: Boolean, required: true, default: false },
  preRequisiteCourses: { type: [preRequisiteCourses], default: [] },
});

// For find-like operations
courseSchema.pre(/^find/, function (this: Query<any, any>) {
  this.find({ isDeleted: { $ne: true } });
});

export const CourseModel = model<TCourse>('Course', courseSchema);

const courseFacultySchema = new Schema<TCourseFaculty>({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    unique: true,
  },
  faculties: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
    },
  ],
});

export const CourseFacultyModel = model<TCourseFaculty>(
  'CourseFaculty',
  courseFacultySchema,
);
