import express, { NextFunction, Request, Response } from 'express';
import { userControllers } from './user.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { studentValidationSchema } from '../student/student.validation';
import { FacultyValidationSchema } from '../faculty/faculty.validation';
import { AdminValidationSchema } from '../admin/admin.validation';
import { auth } from '../../middlewares/authRequest';
import { USER_ROLE } from './user.constant';
import { changeStatusValidationSchema } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(studentValidationSchema),
  userControllers.createStudent,
);

router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),
  validateRequest(FacultyValidationSchema),
  userControllers.createFaculty,
);

router.post(
  '/create-admin',
  // auth(USER_ROLE.admin),
  validateRequest(AdminValidationSchema),
  userControllers.createAdmin,
);

router.get(
  '/me',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  userControllers.getMyData,
);

router.post(
  '/change-status/:id',
  auth(USER_ROLE.admin),
  validateRequest(changeStatusValidationSchema),
  userControllers.changeUserStatus,
);

export const userRoute = router;
