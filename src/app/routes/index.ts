import { SemesterRegistrationRoutes } from '../modules/semesterRegistration/semesterRegistration.route';
import { Router } from 'express';
import { studentRoute } from '../modules/student/student.route';
import { userRoute } from '../modules/user/user.route';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';
import { AcademicFacultyRoute } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.route';
import { FacultyRoutes } from '../modules/faculty/faculty.route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { CourseRoutes } from '../modules/course/course.route';
import { OfferedCourseRoutes } from '../modules/offeredCourse/offeredCourse.route';
import { LoginUserRoutes } from '../modules/auth/auth.route';
import { EnrolledCourseRoutes } from '../modules/enrolledCourse/enrolledCourse.Route';

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
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoute,
  },
  {
    path: '/academic-departments',
    route: AcademicDepartmentRoutes,
  },
  {
    path: '/faculties',
    route: FacultyRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/courses',
    route: CourseRoutes,
  },
  {
    path: '/semester-registrations',
    route: SemesterRegistrationRoutes,
  },
  {
    path: '/offered-courses',
    route: OfferedCourseRoutes,
  },
  {
    path: '/auth',
    route: LoginUserRoutes,
  },
  {
    path: '/enrolled-courses',
    route: EnrolledCourseRoutes,
  },
];

routeModules.forEach((route) => router.use(route.path, route.route));

export default router;
