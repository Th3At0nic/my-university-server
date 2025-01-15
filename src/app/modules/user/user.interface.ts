/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
};

export interface IUser extends Model<TUser> {
  isUserExists(id: string): Promise<TUser | null>;
  isPasswordCorrect(
    plainTextPassword: string,
    hashPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePassChanged(
    changedPassAt: Date,
    issuedAt: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
