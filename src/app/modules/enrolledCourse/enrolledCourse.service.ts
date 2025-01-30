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
    )
      .session(session)
      .select('maxCredit');
    if (!registeredSemester) {
      throw new NotFoundError('Semester Registration Not Found', [
        {
          path: 'semesterRegistrationId',
          message: 'Invalid semester registration ID.',
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

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
};
