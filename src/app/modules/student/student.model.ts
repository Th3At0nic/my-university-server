/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { model, Query, Schema } from 'mongoose';
import {
  TGuardian,
  TStudent,
  TUserName,
  TLocalGuardian,
  IStudent,
} from './student.interface';

const userNameSchema = new Schema<TUserName>({
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

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: true,
    maxlength: [50, "Name can't have more than 50 characters"],
  },
  fatherOccupation: { type: String, required: true },
  fatherContact: { type: String, required: true },
  motherName: {
    type: String,
    required: true,
    maxlength: [50, "Name can't have more than 50 characters"],
  },
  motherOccupation: { type: String, required: true },
  motherContact: { type: String, required: true },
});

const LocalGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: true,
    maxlength: [50, "Name can't have more than 50 characters"],
  },
  occupation: { type: String, required: true },
  contactNo: { type: String, required: true },
  address: { type: String, required: true },
});

const studentSchema = new Schema<TStudent>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: [40, "id can't have more than 40 characters"],
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'User',
    },
    name: {
      type: userNameSchema,
      required: true,
    },
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
    guardian: { type: guardianSchema, required: true },
    localGuardian: { type: LocalGuardianSchema },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Academic_Department',
    },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Academic_Semester',
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Academic_Faculty',
    },
    isDeleted: { type: Boolean, required: true },
    profileImg: { type: String, default: '' },
  },
  {
    toJSON: {
      virtuals: true,
    },
    timestamps: true,
  },
);

//creating mongoose virtual to derive property by computing
studentSchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
});

// hiding the deleted students to the user end by filtering

// For find-like operations
studentSchema.pre(/^find/, function (this: Query<any, any>) {
  this.find({ isDeleted: { $ne: true } });
});

// this is also same: hiding the delted data to the client if searched, but this specailly work for aggregate method if used in the service
studentSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
});

//creating a static method for the student Schema which will be use to query on the db
studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await StudentModel.findOne({ id });
  return existingUser;
};

export const StudentModel = model<TStudent, IStudent>('Student', studentSchema);
