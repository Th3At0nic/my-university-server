import { model, Schema } from 'mongoose';
import {
  Guardian,
  Student,
  UserName,
  LocalGuardian,
} from './student/student.interface';

const userNameSchema = new Schema<UserName>({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: [20, "First name can't have more than 20 characters"],
    validate: {
      validator: function (value: string) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        return firstNameStr === value;
      },
      message: '{VALUE} is not in capitalized format!',
    },
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

const guardianSchema = new Schema<Guardian>({
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

const LocalGuardianSchema = new Schema<LocalGuardian>({
  name: {
    type: String,
    required: true,
    maxlength: [50, "Name can't have more than 50 characters"],
  },
  occupation: { type: String, required: true },
  contactNo: { type: String, required: true },
  address: { type: String, required: true },
});

const studentSchema = new Schema<Student>({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: [15, "id can't have more than 15 characters"],
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
  dateOfBirth: { type: String, required: true },
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
  profileImg: { type: String },
  isActive: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active',
  },
});

export const StudentModel = model<Student>('Student', studentSchema);
