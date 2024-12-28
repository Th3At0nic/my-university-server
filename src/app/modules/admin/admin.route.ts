import { Router } from 'express';
import { AdminControllers } from './admin.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { updateAdminValidationSchema } from './admin.validation';

const router = Router();

router.get('/', AdminControllers.getAllAdmins);

router.get('/:id', AdminControllers.getAnAdmin);

router.patch(
  '/:id',
  validateRequest(updateAdminValidationSchema),
  AdminControllers.updateAdmin,
);

router.delete('/:id', AdminControllers.deleteAdmin);

export const AdminRoutes = router;
