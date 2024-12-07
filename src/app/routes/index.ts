import { Router } from 'express';
import { studentRoute } from '../modules/student/student.route';
import { userRoute } from '../modules/user/user.route';

const router = Router();

const routeModules = [
  {
    path: '/students',
    route: studentRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
];

routeModules.forEach((route) => router.use(route.path, route.route));

export default router;
