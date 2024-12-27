import { model, Schema } from 'mongoose';
import { TFaculty } from './faculty.interface';

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
    name: { type: String, required: true },
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
    contactNo: { type: String, required: true, unique: true },
    emergencyContactNo: { type: String, required: true },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    profileImage: { type: String, required: true },
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
  { timestamps: true },
);

facultySchema.pre('find', function () {
  this.find({ isDeleted: { $ne: true } });
});

facultySchema.pre('findOne', function () {
  this.findOne({ isDeleted: { $ne: true } });
});

export const FacultyModel = model<TFaculty>('Faculty', facultySchema);
