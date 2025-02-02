import { OfferedCourseModel } from './offeredCourse.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { InternalServerError } from '../../errors/InternalServerError';
import { NotFoundError } from '../../errors/NotFoundError';
import { ConflictError } from '../../errors/ConflictError';
import { DepartmentModel } from '../academicDepartment/academicDepartment.model';
import { SemesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model';
import { CourseModel } from '../course/course.model';
import { FacultyModel } from '../faculty/faculty.model';
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model';
import { hasTimeConflict } from './offeredCourse.utils';
import { TSemesterRegistration } from '../semesterRegistration/semesterRegistration.interface';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { StudentModel } from '../student/student.model';
import { EnrolledCourseModel } from '../enrolledCourse/enrolledCourse.model';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    academicDepartment,
    academicFaculty,
    faculty,
    section,
    course,
    days,
    startTime,
    endTime,
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

  const DepartmentBelongToFaculty = isDepartmentExists.academicFaculty;

  if (DepartmentBelongToFaculty.toString() !== academicFaculty.toString()) {
    throw new NotFoundError(
      `The Academic Department is not belong to the Academic Faculty`,
      [
        {
          path: `academicDepartment & academicFaculty`,
          message: `${isDepartmentExists?.name} is not belong to the ${isAcademicFacultyExists.name}`,
        },
      ],
    );
  }

  // finding any same offered course with the same registered semester and same section
  const isDuplicateSectionInSemester = await OfferedCourseModel.findOne({
    semesterRegistration,
    course,
    section,
  });
  // checking if the offeredCourse in the same register semester and section is duplicate or not..
  if (isDuplicateSectionInSemester) {
    throw new ConflictError('Duplicate Section Detected', [
      {
        path: 'section',
        message: `The section '${section}' for course '${course}' in semester '${semesterRegistration}' already exists. Please provide a unique section.`,
      },
    ]);
  }

  const assignedSchedules = await OfferedCourseModel.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedules = {
    startTime,
    endTime,
    days,
  };

  const hasConflict = hasTimeConflict(assignedSchedules, newSchedules);

  if (hasConflict?.conflict) {
    throw new ConflictError('Time conflict detected', [
      {
        path: 'startTime, endTime',
        message: `The faculty member already has a class scheduled on this time on the same days. Please choose a different time or day.`,
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

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(query, OfferedCourseModel.find())
    .filter()
    .sortBy()
    .paginate()
    .fields();
  const result = await offeredCourseQuery.modelQuery;
  if (!result || result.length === 0) {
    throw new NotFoundError('No Offered Courses Found', [
      {
        path: 'offeredCourses',
        message:
          'No offered courses are currently available in the system. Please ensure courses have been created or contact support for assistance.',
      },
    ]);
  }

  const meta = await offeredCourseQuery.countTotal();

  return { meta, result };
};

const getMyOfferedCoursesFromDB = async (userId: string) => {
  // 1️⃣ Find student details
  const student = await StudentModel.findOne({ id: userId });

  if (!student) {
    throw new NotFoundError('Student Not Found', [
      {
        path: 'authorization.token',
        message:
          'No student was found in the system. Please login and try again',
      },
    ]);
  }

  // 2️⃣ Get the current ongoing semester
  const currentOngoingRegistrationSemester =
    await SemesterRegistrationModel.findOne({ status: 'ONGOING' });

  if (!currentOngoingRegistrationSemester) {
    throw new NotFoundError('Ongoing Semester Registration Not Found', [
      {
        path: 'semesterRegistration',
        message:
          'No ongoing semester registration was found. Please check if the registration period has started.',
      },
    ]);
  }

  // 3️⃣ Get the courses the student has already enrolled in
  const enrolledCourses = await EnrolledCourseModel.find({
    student: student._id,
    academicDepartment: student.academicDepartment,
    semesterRegistration: currentOngoingRegistrationSemester._id,
  }).select('course');

  const enrolledCourseIds = enrolledCourses.map((course) => course.course);

  // 4️⃣ Find offered courses, excluding already enrolled courses
  const unenrolledOfferedCourses = await OfferedCourseModel.find({
    semesterRegistration: currentOngoingRegistrationSemester._id,
    academicFaculty: student.academicFaculty,
    academicDepartment: student.academicDepartment,
    course: { $nin: enrolledCourseIds }, // Exclude already enrolled courses
  }).populate('course');

  if (!unenrolledOfferedCourses.length) {
    throw new NotFoundError('No Available Courses Found', [
      {
        path: 'offeredCourses',
        message:
          'You have either enrolled in all available courses or no courses are currently offered for your department and semester.',
      },
    ]);
  }

  return unenrolledOfferedCourses;
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
  const restrictedFields = [
    'academicDepartment',
    'academicFaculty',
    'academicSemester',
    'course',
  ];

  const invalidFields = restrictedFields.filter(
    (field) => payload[field as keyof typeof payload],
  );

  if (invalidFields.length > 0) {
    throw new ConflictError(
      `${invalidFields.join(', ')} field(s) cannot be updated as they are restricted.`,
      invalidFields.map((field) => ({
        path: field,
        message: `${field} is a restricted field and cannot be updated.`,
      })),
    );
  }

  const isOfferedCourseExists = await OfferedCourseModel.findById(id);
  if (!isOfferedCourseExists) {
    throw new NotFoundError('Offered Course Not Found', [
      {
        path: 'id',
        message:
          'The specified Offered Course does not exist in the system. Please check the ID and try again.',
      },
    ]);
  }

  const { faculty, startTime, endTime, days } = payload;

  const isFacultyExists = await FacultyModel.findById(faculty);
  if (!isFacultyExists) {
    throw new NotFoundError('Faculty Member Not Found', [
      {
        path: 'faculty',
        message: `The Faculty Member with ID: ${payload.faculty} was not found in the system. Please verify the ID and try again.`,
      },
    ]);
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration;

  const registeredSemesterData =
    await SemesterRegistrationModel.findById(semesterRegistration);

  if (registeredSemesterData?.status !== 'UPCOMING') {
    throw new ConflictError('Cannot update, semester is not upcoming', [
      {
        path: 'semesterRegistration',
        message: `The semester with ID: ${semesterRegistration} is not in the "UPCOMING" status. Updates can only be made for semesters that are in the "UPCOMING" status.`,
      },
    ]);
  }

  const assignedSchedules = await OfferedCourseModel.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  // Early check for no schedules to avoid unnecessary conflict check
  if (!assignedSchedules || assignedSchedules.length === 0) {
    throw new ConflictError('No existing schedules found', [
      {
        path: 'days, startTime, endTime',
        message:
          'The specified faculty member has no existing schedules to check for conflicts.',
      },
    ]);
  }

  if (startTime && endTime && days) {
    const newSchedules = {
      startTime,
      endTime,
      days,
    };

    const hasConflict = hasTimeConflict(assignedSchedules, newSchedules);

    if (hasConflict?.conflict) {
      throw new ConflictError('Time conflict detected', [
        {
          path: 'startTime, endTime',
          message: `The faculty member already has a class scheduled on this time on the same days. Please choose a different time or day.`,
        },
      ]);
    }
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

const deleteOfferedCourseFromDB = async (id: string) => {
  const isOfferedCourseExists = await OfferedCourseModel.findById(
    id,
  ).populate<TSemesterRegistration>('semesterRegistration');

  if (!isOfferedCourseExists) {
    throw new NotFoundError('Offered Course Not Found', [
      {
        path: 'id',
        message: 'No offered course found with the provided ID.',
      },
    ]);
  }

  //by using populate i avoided further query on the DB, enhance performance
  const registeredSemesterID = isOfferedCourseExists?.semesterRegistration;

  if (!registeredSemesterID) {
    throw new NotFoundError('Registered Semester Not Found', [
      {
        path: 'semesterRegistration',
        message: `No registered semester found with the provided ID: ${id}. Deletion of the offered course is not allowed.`,
      },
    ]);
  }

  const isRegisteredSemesterExists =
    await SemesterRegistrationModel.findById(registeredSemesterID);

  const registeredSemesterStatus = isRegisteredSemesterExists?.status;

  if (registeredSemesterStatus !== 'UPCOMING') {
    throw new ConflictError(
      `Cannot delete, semester is ${registeredSemesterStatus}`,
      [
        {
          path: 'semesterRegistration',
          message: `Cannot delete. The semester status is "${registeredSemesterStatus}", but only "UPCOMING" semesters can be deleted.
`,
        },
      ],
    );
  }

  const result = await OfferedCourseModel.findByIdAndDelete(id);

  if (!result) {
    throw new ConflictError('Deletion Failed', [
      {
        path: 'id',
        message: 'Failed to delete the offered course due to a conflict.',
      },
    ]);
  }

  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getMyOfferedCoursesFromDB,
  getAOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
  deleteOfferedCourseFromDB,
};
