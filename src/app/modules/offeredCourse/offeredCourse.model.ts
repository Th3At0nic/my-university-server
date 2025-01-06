import { Schema, model } from 'mongoose';
import { TOfferedCourse } from './offeredCourse.interface';

const offeredCourseSchema = new Schema<TOfferedCourse>(
  {
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      ref: 'Semester_Registration',
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
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: 'Academic_Semester',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
    },
    maxCapacity: {
      type: Number,
      required: true,
      min: 1,
    },
    section: {
      type: Number,
      required: true,
    },
    days: [
      {
        type: String,
        enum: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        required: true,
      },
    ],
    startTime: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value); // Validates HH:mm format
        },
        message: 'Start time must be in HH:mm format',
      },
    },
    endTime: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value); // Validates HH:mm format
        },
        message: 'End time must be in HH:mm format',
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
);

export const OfferedCourseModel = model<TOfferedCourse>(
  'Offered_Course',
  offeredCourseSchema,
);
