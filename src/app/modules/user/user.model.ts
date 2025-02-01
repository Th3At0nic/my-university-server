import { model, Schema } from 'mongoose';
import { IUser, TUser } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import { userStatus } from './user.constant';

export const userSchema = new Schema<TUser>(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 },
    needsPasswordChange: { type: Boolean, required: true, default: true },
    passwordChangedAt: { type: Date },
    role: {
      type: String,
      enum: ['admin', 'student', 'faculty', 'super-admin'],
      required: true,
    },
    status: {
      type: String,
      enum: userStatus,
      default: 'in-progress',
      required: true,
    },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

//creating or using mongoose middleware like pre and post
userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_round_salt),
  );
});

// hiding the password from the response document to keep the privacy.
userSchema.post('save', function (doc) {
  doc.password = '';
});

//finding for existing user in the db so prevent duplicate creation
userSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await UserModel.findOne({ id }).select('+password');
  return existingUser;
};

userSchema.statics.isPasswordCorrect = async function (
  plainTextPassword: string,
  hashPassword: string,
) {
  const authPassword = await bcrypt.compare(plainTextPassword, hashPassword);
  return authPassword;
};

userSchema.statics.isJWTIssuedBeforePassChanged = function (
  PassChangedAt: Date,
  tokenIssuedAt: number,
) {
  const passChangeTime = Math.floor(new Date(PassChangedAt).getTime() / 1000);
  return passChangeTime > tokenIssuedAt;
};

export const UserModel = model<TUser, IUser>('User', userSchema);
