import { Types } from 'mongoose';

export type TFaculty = {
  id: string;
  user: Types.ObjectId;
  designation: string;
  name: string;
  gender: 'male' | 'female' | 'others';
  dateOfBirth?: Date;
  contactNo: string;
  emergencyContactNo: string;
  presentAddress: string;
  permanentAddress: string;
  profileImage: string;
  academicFaculty: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  isDeleted: boolean;
};
