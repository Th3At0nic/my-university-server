import { OfferedCourseModel } from './offeredCourse.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { InternalServerError } from '../../utils/errors/InternalServerError';
import { NotFoundError } from '../../utils/errors/NotFoundError';
import { ConflictError } from '../../utils/errors/ConflictError';
import { DepartmentModel } from '../academicDepartment/academicDepartment.model';
import { SemesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model';
import { CourseModel } from '../course/course.model';
import { FacultyModel } from '../faculty/faculty.model';
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    academicDepartment,
    academicFaculty,
    faculty,
    course,
    semesterRegistration,
  } = payload;

  const isCourseExists = await CourseModel.findById(course);
  if (!isCourseExists) {
    throw new NotFoundError('Course Not Found', [
      {
        path: `course`,
        message: `The specified course ID: ${course} does not exist in the system. Please verify the ID and try again`,
      },
    ]);
  }

  const isFacultyExists = await FacultyModel.findById(faculty);
  if (!isFacultyExists) {
    throw new NotFoundError('Faculty Not Found', [
      {
        path: `faculty`,
        message: `The specified faculty ID: ${faculty} does not exist in the system. Please verify the ID and try again`,
      },
    ]);
  }

  const isAcademicFacultyExists =
    await AcademicFacultyModel.findById(academicFaculty);
  if (!isAcademicFacultyExists) {
    throw new NotFoundError('Academic Faculty Not Found', [
      {
        path: `academicFaculty`,
        message: `The specified academic faculty ID: ${academicFaculty} does not exist in the system. Please verify the ID and try again`,
      },
    ]);
  }

  const isDepartmentExists = await DepartmentModel.findById(academicDepartment);
  if (!isDepartmentExists) {
    throw new NotFoundError('Academic Department Not Found', [
      {
        path: 'academicDepartment',
        message: `The specified Academic Department not found with provided ID: ${academicDepartment}. Please check the ID and try again`,
      },
    ]);
  }

  const isSemesterRegistered =
    await SemesterRegistrationModel.findById(semesterRegistration);
  if (!isSemesterRegistered) {
    throw new NotFoundError('Semester Registration Not Found', [
      {
        path: 'semesterRegistration',
        message: `The specified Semester Registration ID: ${semesterRegistration} does not exist in the system. Please verify the ID and try again.`,
      },
    ]);
  }

  if (isSemesterRegistered) {
    payload.academicSemester = isSemesterRegistered.academicSemester;
  }

  const result = await OfferedCourseModel.create(payload);

  if (!result) {
    throw new InternalServerError('Failed to create Offered Course', [
      {
        path: 'offeredCourse',
        message:
          'An unexpected error occurred while creating the Offered Course. Please try again later or contact support if the issue persists.',
      },
    ]);
  }
  return result;
};

const getAllOfferedCoursesFromDB = async () => {
  const result = await OfferedCourseModel.find();
  if (!result || result.length === 0) {
    throw new NotFoundError('No Offered Courses Found', [
      {
        path: 'offeredCourses',
        message:
          'No offered courses are currently available in the system. Please ensure courses have been created or contact support for assistance.',
      },
    ]);
  }
  return result;
};

const getAOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourseModel.findById(id);
  if (!result) {
    throw new NotFoundError('Offered Course Not Found', [
      {
        path: 'id',
        message:
          'The specified Offered Course could not be found in the system. Please verify the provided ID and try again.',
      },
    ]);
  }
  return result;
};
const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Partial<TOfferedCourse>,
) => {
  const isCourseExists = await OfferedCourseModel.findById(id);
  if (!isCourseExists) {
    throw new NotFoundError('Offered Course Not Found', [
      {
        path: 'id',
        message:
          'The specified Offered Course does not exist in the system. Please check the ID and try again.',
      },
    ]);
  }

  const result = await OfferedCourseModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ConflictError('Failed to Update Offered Course', [
      {
        path: 'id',
        message:
          'The update operation failed due to conflicting or invalid data. Please verify the payload and ensure no conflicts with existing data.',
      },
    ]);
  }

  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getAOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
};
