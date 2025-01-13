import { Router } from 'express';
import { AdminControllers } from './admin.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { updateAdminValidationSchema } from './admin.validation';
import { auth } from '../../middlewares/authRequest';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.faculty),
  AdminControllers.getAllAdmins,
);

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.faculty),
  AdminControllers.getAnAdmin,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(updateAdminValidationSchema),
  AdminControllers.updateAdmin,
);

router.delete('/:id', auth(USER_ROLE.admin), AdminControllers.deleteAdmin);

export const AdminRoutes = router;
