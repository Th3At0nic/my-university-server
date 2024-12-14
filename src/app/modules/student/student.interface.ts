// import { TStudent } from './student.interface';

import { Model, Types } from 'mongoose';

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContact: string;
  motherName: string;
  motherOccupation: string;
  motherContact: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  name: TUserName;
  gender: 'male' | 'female' | 'others';
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian?: TLocalGuardian;
  admissionSemester: Types.ObjectId;
  profileImg?: string;
};

// creating a static methods interface
export interface IStudent extends Model<TStudent> {
  // eslint-disable-next-line no-unused-vars
  isUserExists(id: string): Promise<TStudent | null>;
}

// creating a type of for a function which will used in other file for find the user is exists or not in the db
// export type TStudentMethods = {
//   // eslint-disable-next-line no-unused-vars
//   isUserExists(id: string): Promise<TStudent | null>;
// };

// creating a type of a model which will be passed into the real model to let the mongoose know about this model which will be use to  query on the db , this is needed for type-safety
// export type TStudentModel = Model<
//   TStudent,
//   Record<string, never>,
//   TStudentMethods
// >;
