import { SemesterRegistrationModel } from './../semesterRegistration/semesterRegistration.model';
import { ConflictError } from '../../errors/ConflictError';
import { InternalServerError } from '../../errors/InternalServerError';
import { NotFoundError } from '../../errors/NotFoundError';
import { OfferedCourseModel } from '../offeredCourse/offeredCourse.model';
import { StudentModel } from '../student/student.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import { EnrolledCourseModel } from './enrolledCourse.model';
import { startSession } from 'mongoose';
import { CourseModel } from '../course/course.model';
import { FacultyModel } from '../faculty/faculty.model';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { calculateGradeAndPoints } from './enrolledCourse.utils';
import { QueryBuilder } from '../../builder/QueryBuilder';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const { offeredCourse } = payload;

    const isOfferedCourseExists =
      await OfferedCourseModel.findById(offeredCourse);
    if (!isOfferedCourseExists) {
      throw new NotFoundError('Offered Course Not Found', [
        {
          path: 'offeredCourse',
          message:
            'Offered Course not found in the system. Please check the offeredCourse ID and try again.',
        },
      ]);
    }

    //checking if the max capacity of the offeredCourse exceeds or available
    if (isOfferedCourseExists.maxCapacity <= 0) {
      throw new NotFoundError('Classroom is full', [
        {
          path: 'offeredCourse',
          message: "Sorry, the classroom is full. Can't enroll more.",
        },
      ]);
    }

    //retrieve the student with the custom id to check availability and get the student mongodb id
    const student = await StudentModel.findOne({ id: userId }).select('_id');

    if (!student) {
      throw new NotFoundError('Student Not Found', [
        {
          path: 'authorization',
          message: 'It seems you are not authorized. Student not found.',
        },
      ]);
    }

    //checking if the student with same registeredSem and same course enrolled before or not
    const isTheStudentEnrolled = await EnrolledCourseModel.findOne({
      semesterRegistration: isOfferedCourseExists.semesterRegistration,
      offeredCourse: isOfferedCourseExists._id,
      student: student._id,
    }).session(session);

    if (isTheStudentEnrolled) {
      throw new ConflictError('Student already enrolled', [
        {
          path: 'forbidden',
          message: 'It seems you already enrolled.',
        },
      ]);
    }

    // 1️⃣ Fetch the registered semester's max credits
    const registeredSemester = await SemesterRegistrationModel.findById(
      isOfferedCourseExists.semesterRegistration,
    ).session(session);

    if (!registeredSemester) {
      throw new NotFoundError('Semester Registration Not Found', [
        {
          path: 'semesterRegistrationId',
          message: 'Invalid semester registration ID.',
        },
      ]);
    }

    if (registeredSemester.status === 'ENDED') {
      throw new ConflictError('Enrollment not allowed', [
        {
          path: 'semesterRegistration',
          message: `You cannot enroll in a semester that has already ${registeredSemester.status}.`,
        },
      ]);
    }

    const maxCredit = registeredSemester.maxCredit;

    // 2️⃣ Get the course's credit of which is going to be enrolled by the given offeredCourse
    const newCourse = await CourseModel.findById(isOfferedCourseExists.course)
      .session(session)
      .select('credits');
    if (!newCourse) {
      throw new NotFoundError('Course Not Found', [
        { path: 'courseId', message: 'Invalid course ID.' },
      ]);
    }
    const newCourseCredits = newCourse.credits;

    // 3️⃣ Get all enrolled courses for a student in the same registered semester
    const enrolledCourses = await EnrolledCourseModel.find({
      student: student._id,
      semesterRegistration: isOfferedCourseExists.semesterRegistration,
    })
      .session(session)
      .select('course');

    // 4️⃣ Fetch total enrolled credits
    const enrolledCourseIds = enrolledCourses.map((ec) => ec.course);
    const enrolledCredits = await CourseModel.aggregate([
      { $match: { _id: { $in: enrolledCourseIds } } },
      { $group: { _id: null, totalCredits: { $sum: '$credits' } } },
    ]).session(session);

    const totalEnrolledCredits =
      enrolledCredits.length > 0 ? enrolledCredits[0].totalCredits : 0;

    const totalAfterEnrollment = totalEnrolledCredits + newCourseCredits;

    // 5️⃣ Compare with max credits allowed
    if (totalAfterEnrollment > maxCredit) {
      throw new ConflictError('Credit Limit Exceeded', [
        {
          path: 'credits',
          message: `Total credits (${totalAfterEnrollment}) exceed the allowed limit (${maxCredit}).`,
        },
      ]);
    }

    //finally after passing all these validations, we let the student to be enrolled, creating EnrolledCourse
    const result = await EnrolledCourseModel.create(
      [
        {
          semesterRegistration: isOfferedCourseExists.semesterRegistration,
          academicSemester: isOfferedCourseExists.academicSemester,
          academicFaculty: isOfferedCourseExists.academicFaculty,
          academicDepartment: isOfferedCourseExists.academicDepartment,
          offeredCourse: offeredCourse,
          course: isOfferedCourseExists.course,
          student: student._id,
          faculty: isOfferedCourseExists.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );

    if (!result) {
      throw new InternalServerError(
        'Failed to enroll in the course due to an unexpected server issue.',
        [
          {
            path: '',
            message:
              'An unexpected error occurred while processing your request. Please try again later or contact support if the issue persists.',
          },
        ],
      );
    }

    // Reduce maxCapacity after enrollment
    await OfferedCourseModel.findByIdAndUpdate(
      offeredCourse,
      { $inc: { maxCapacity: -1 } },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const updateCourseMarksIntoDB = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

  const isSemesterRegistrationExists =
    await SemesterRegistrationModel.findById(semesterRegistration);

  if (!isSemesterRegistrationExists) {
    throw new NotFoundError('Semester Registration Not Found', [
      {
        path: 'semesterRegistration',
        message: 'Semester Registration not found in the system.',
      },
    ]);
  }

  if (isSemesterRegistrationExists.status === 'UPCOMING') {
    throw new ConflictError(
      'Marks cannot be updated for an upcoming semester',
      [
        {
          path: 'semesterRegistration',
          message: 'Marks cannot be updated for an upcoming semester.',
        },
      ],
    );
  }

  const isOfferedCourseExists =
    await OfferedCourseModel.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new NotFoundError('Offered Course Not Found', [
      {
        path: 'offeredCourse',
        message: 'Offered Course not found in the system.',
      },
    ]);
  }

  const isStudentExists = await StudentModel.findById(student);
  if (!isStudentExists) {
    throw new NotFoundError('Student Not Found', [
      {
        path: 'student',
        message: 'Student not found in the system.',
      },
    ]);
  }

  const isUserFacultyExists = await FacultyModel.findOne({ id: facultyId });
  if (!isUserFacultyExists) {
    throw new NotFoundError('Faculty Not Found', [
      {
        path: 'faculty',
        message: 'Faculty not found in the system.',
      },
    ]);
  }

  const facultyInEnrolledCourse = await EnrolledCourseModel.findOne({
    semesterRegistration: semesterRegistration,
    faculty: isOfferedCourseExists.faculty,
    student: student,
    offeredCourse: offeredCourse,
  });
  if (!facultyInEnrolledCourse) {
    throw new NotFoundError('Faculty does not matched', [
      {
        path: 'faculty',
        message: 'Faculty not matched in the enrolled course.',
      },
    ]);
  }

  if (!isUserFacultyExists._id.equals(facultyInEnrolledCourse.faculty)) {
    throw new UnauthorizedError('Unauthorized Faculty Access', [
      {
        path: 'authorization',
        message:
          'You are not authorized to modify this enrolled course. Only the assigned faculty can access or update this data.',
      },
    ]);
  }

  const modifiedData: Record<string, unknown> = { ...courseMarks };

  if (courseMarks?.finalTerm) {
    const { classTest1, midTerm, classTest2, finalTerm } =
      facultyInEnrolledCourse.courseMarks;

    const totalMarks =
      Math.ceil(classTest1) +
      Math.ceil(midTerm) +
      Math.ceil(classTest2) +
      Math.ceil(finalTerm);

    const courseGradeAndPoints = calculateGradeAndPoints(totalMarks);

    modifiedData.grade = courseGradeAndPoints.grade;
    modifiedData.gradePoints = courseGradeAndPoints.gradePoints;
    modifiedData.isCompleted = true;
  }

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }

  // ❗ Update course marks properly in the database
  const updatedEnrolledCourse = await EnrolledCourseModel.findByIdAndUpdate(
    facultyInEnrolledCourse._id,
    modifiedData,
    { new: true },
  );

  if (!updatedEnrolledCourse) {
    throw new InternalServerError('Failed to update course marks', [
      {
        path: 'database',
        message: 'An unexpected error occurred while updating marks.',
      },
    ]);
  }

  return updatedEnrolledCourse;
};

const getAllEnrolledCourseFromDB = async (query: Record<string, unknown>) => {
  const enrolledCourseQuery = new QueryBuilder(
    query,
    EnrolledCourseModel.find().populate(
      'semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty',
    ),
  );

  const result = await enrolledCourseQuery.modelQuery;
  if (!result.length) {
    throw new InternalServerError('No enrolled course Found', [
      {
        path: 'database',
        message: 'No enrolled course found in our system',
      },
    ]);
  }

  const meta = await enrolledCourseQuery.countTotal();

  return { meta, result };
};

const getMyEnrolledCoursesFromDB = async (
  studentId: string,
  query: Record<string, unknown>,
) => {
  const isStudentExists = await StudentModel.findOne({ id: studentId });
  if (!isStudentExists) {
    throw new UnauthorizedError(`Unauthorized access!`, [
      {
        path: `${studentId}`,
        message: `Invalid or expired token. Please log in again.`,
      },
    ]);
  }

  const myEnrolledCoursesQuery = new QueryBuilder(
    query,
    EnrolledCourseModel.find({ student: isStudentExists._id }).populate(
      'semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty',
    ),
  );

  const result = await myEnrolledCoursesQuery.modelQuery;
  const meta = await myEnrolledCoursesQuery.countTotal();

  return { meta, result };
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateCourseMarksIntoDB,
  getAllEnrolledCourseFromDB,
  getMyEnrolledCoursesFromDB,
};
