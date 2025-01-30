import { Schema, model } from 'mongoose';
import { TCourseMarks, TEnrolledCourse } from './enrolledCourse.interface';

export type TGrade = 'A' | 'B' | 'C' | 'D' | 'F' | 'NA';

const CourseMarksSchema = new Schema<TCourseMarks>({
  classTest1: { type: Number, min: 0, max: 10, default: 0 },
  midTerm: { type: Number, min: 0, max: 30, default: 0 },
  classTest2: { type: Number, min: 0, max: 10, default: 0 },
  finalTerm: { type: Number, min: 0, max: 50, default: 0 },
});

const EnrolledCourseSchema = new Schema<TEnrolledCourse>(
  {
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      ref: 'Semester_Registration',
      required: true,
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: 'Academic_Semester',
      required: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'Academic_Faculty',
      required: true,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'Academic_Department',
      required: true,
    },
    offeredCourse: {
      type: Schema.Types.ObjectId,
      ref: 'Offered_Course',
      required: true,
    },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    faculty: { type: Schema.Types.ObjectId, ref: 'Faculty', required: true },
    isEnrolled: { type: Boolean, default: false },
    courseMarks: { type: CourseMarksSchema, default: {} },
    grade: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'F', 'NA'],
      default: 'NA',
    },
    gradePoints: { type: Number, min: 0, max: 4, default: 0 },
    isCompleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const EnrolledCourseModel = model<TEnrolledCourse>(
  'EnrolledCourse',
  EnrolledCourseSchema,
);
