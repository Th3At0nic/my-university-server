import { model, Schema } from 'mongoose';
import {
  TGuardian,
  TStudent,
  TUserName,
  TLocalGuardian,
  IStudent,
} from './student.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

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
      maxlength: [15, "id can't have more than 15 characters"],
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'User',
    },
    password: {
      type: String,
      required: true,
      trim: true,
      maxlength: [35, "Password can't have more than 35 characters"],
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

//creating mongoose virtual to derive property by computing
studentSchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});

//creating or using mongoose middleware like pre and post
studentSchema.pre('save', async function () {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_round_salt),
  );
});

// hiding the deleted students to the user end by filtering
studentSchema.pre('find', function () {
  this.find({ isDeleted: { $ne: true } });
});

// this is also same: hiding the delted data to the client if searched, but this specailly work for aggregate method if used in the service
studentSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
});

//hiding the deleted student to the client if the client search student by the id which is deleted earlier
studentSchema.pre('findOne', function () {
  this.findOne({ isDeleted: { $ne: true } });
});

// hiding the password from the response document to keep the privacy.
studentSchema.post('save', function (doc) {
  doc.password = '';
});

//creating a static method for the student Schema which will be use to query on the db
studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await StudentModel.findOne({ id });
  return existingUser;
};

//these are used to  create an instance method into the schema. this method will query on the db
// studentSchema.methods.isUserExists = async function (id: string) {
//   const existingUser = await StudentModel.findOne({ id });

//   return existingUser;
// };

export const StudentModel = model<TStudent, IStudent>('Student', studentSchema);
