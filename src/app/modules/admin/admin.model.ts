/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { model, Query, Schema } from 'mongoose';
import { TAdmin, TAdminName } from './admin.interface';

const adminNameSchema = new Schema<TAdminName>({
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

const adminSchema = new Schema<TAdmin>(
  {
    id: { type: String, required: true, unique: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    designation: { type: String, required: true },
    name: { type: adminNameSchema, required: true },
    gender: {
      type: String,
      enum: ['male', 'female', 'others'],
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
    profileImage: { type: String, required: true },
    managementDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'Academic_Department',
      required: true,
    },
    isDeleted: { type: Boolean, required: true },
  },
  { timestamps: true },
);

// For find-like operations
adminSchema.pre(/^find/, function (this: Query<any, any>) {
  this.find({ isDeleted: { $ne: true } });
});

export const AdminModel = model<TAdmin>('Admin', adminSchema);
