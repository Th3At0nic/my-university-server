/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { model, Query, Schema } from 'mongoose';
import { TFaculty, TFacultyName } from './faculty.interface';

const facultyNameSchema = new Schema<TFacultyName>({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: [20, "First name can't have more than 20 characters"],
  },
  middleName: {
    type: String,
    trim: true,
    maxlength: [20, "Middle name can't have more than 20 characters"],
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: [20, "Last name can't have more than 20 characters"],
  },
});

export const facultySchema = new Schema<TFaculty>(
  {
    id: { type: String, required: true, unique: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    designation: { type: String, required: true },
    name: { type: facultyNameSchema, required: true },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'others'],
        message:
          "{VALUE} is not valid. Gender can be only 'male', 'female' or 'others'",
      },
      required: true,
    },
    dateOfBirth: { type: Date },
    email: { type: String, required: true, unique: true },
    contactNo: { type: String, required: true, unique: true },
    emergencyContactNo: { type: String, required: true },
    bloodGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message: '{VALUE} is not valid.',
      },
    },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    profileImage: { type: String, default: '' },
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
    isDeleted: { type: Boolean, required: true },
  },
  {
    toJSON: {
      virtuals: true,
    },
    timestamps: true,
  },
);

//creating mongoose virtual to derive property by computing
facultySchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
});

// For find-like operations
facultySchema.pre(/^find/, function (this: Query<any, any>) {
  this.find({ isDeleted: { $ne: true } });
});

export const FacultyModel = model<TFaculty>('Faculty', facultySchema);
