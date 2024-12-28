import { model, Schema } from 'mongoose';
import { TAdmin } from './admin.interface';

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
    name: { type: String, required: true },
    gender: {
      type: String,
      enum: ['male', 'female', 'others'],
      required: true,
    },
    dateOfBirth: { type: Date },
    email: { type: String, required: true, unique: true },
    contactNo: { type: String, required: true, unique: true },
    emergencyContactNo: { type: String, required: true },
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

adminSchema.pre('find', function () {
  this.find({ isDeleted: { $ne: true } });
});

adminSchema.pre('findOne', function () {
  this.findOne({ isDeleted: { $ne: true } });
});

export const AdminModel = model<TAdmin>('Admin', adminSchema);
