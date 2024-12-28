import { Types } from 'mongoose';

export type TAdmin = {
  id: string;
  user: Types.ObjectId;
  designation: string;
  name: string;
  gender: 'male' | 'female' | 'others';
  dateOfBirth: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  presentAddress: string;
  permanentAddress: string;
  profileImage: string;
  managementDepartment: Types.ObjectId;
  isDeleted: boolean;
};
