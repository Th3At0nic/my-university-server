import { ConflictError } from '../../utils/errors/ConflictError';
import { NotFoundError } from '../../utils/errors/NotFoundError';
import { UserModel } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import bcrypt from 'bcrypt';

const loginUserAuth = async (payload: TLoginUser) => {
  const { id, password } = payload;

  const isUserExists = await UserModel.findOne({ id: id });

  if (!isUserExists) {
    throw new NotFoundError('User Not Found!', [
      {
        path: 'id',
        message: `The User with the provided ID: ${id} not found in the system. Please recheck the ID and try again`,
      },
    ]);
  }

  const isUserDeleted = isUserExists?.isDeleted;
  if (isUserDeleted) {
    throw new NotFoundError('User Not Found!', [
      {
        path: 'id',
        message: `The User with the provided ID: ${id} not found in the system. Please recheck the ID and try again`,
      },
    ]);
  }

  const isUserBlocked = isUserExists?.status;
  if (isUserBlocked === 'blocked') {
    throw new ConflictError('User is Blocked', [
      {
        path: 'status',
        message: `The user with the provided ID: ${id} is currently blocked. Access is restricted until the block is lifted.`,
      },
    ]);
  }

  const checkPassword = await bcrypt.compare(password, isUserExists?.password);
  console.log('ekhane password chek kora hoy: ', checkPassword);

  return isUserExists;
};

export const LoginUserServices = {
  loginUserAuth,
};
