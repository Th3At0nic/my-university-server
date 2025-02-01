import config from '../config';
import { USER_ROLE } from '../modules/user/user.constant';
import { TUser } from '../modules/user/user.interface';
import { UserModel } from '../modules/user/user.model';

const superUser: TUser = {
  id: '0001',
  email: 'rahatdevstudio@gmail.com',
  password: config.super_admin_password as string,
  needsPasswordChange: false,
  role: USER_ROLE.superAdmin,
  status: 'in-progress',
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  let result = undefined;
  const isSuperAdminExists = await UserModel.findOne({
    role: USER_ROLE.superAdmin,
  });

  if (!isSuperAdminExists) {
    result = await UserModel.create(superUser);
  }
  return result ? 'Super Admin is created in the DB' : undefined;
};

export default seedSuperAdmin;
