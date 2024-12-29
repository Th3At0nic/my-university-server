import { Types } from 'mongoose';

export type TAdminName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TAdmin = {
  id: string;
  user: Types.ObjectId;
  designation: string;
  name: TAdminName;
  gender: 'male' | 'female' | 'others';
  dateOfBirth: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  profileImage: string;
  managementDepartment: Types.ObjectId;
  isDeleted: boolean;
};
