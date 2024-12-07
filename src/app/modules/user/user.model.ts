import { model, Schema } from 'mongoose';
import { TUser } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

export const userSchema = new Schema<TUser>(
  {
    id: { type: String, required: true },
    password: { type: String, required: true },
    needsPasswordChange: { type: Boolean, required: true, default: true },
    role: {
      type: String,
      enum: ['admin', 'student', 'faculty'],
      required: true,
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
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

export const UserModel = model<TUser>('User', userSchema);
