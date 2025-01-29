import { ConflictError } from '../../errors/ConflictError';
import { InternalServerError } from '../../errors/InternalServerError';
import { NotFoundError } from '../../errors/NotFoundError';
import { OfferedCourseModel } from '../offeredCourse/offeredCourse.model';
import { StudentModel } from '../student/student.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import { EnrolledCourseModel } from './enrolledCourse.model';
import { startSession } from 'mongoose';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const { offeredCourse } = payload;

    const isOfferedCourseExists =
      await OfferedCourseModel.findById(offeredCourse).session(session);
    if (!isOfferedCourseExists) {
      throw new NotFoundError('Offered Course Not Found', [
        {
          path: 'offeredCourse',
          message:
            'Offered Course not found in the system. Please check the offeredCourse ID and try again.',
        },
      ]);
    }

    if (isOfferedCourseExists.maxCapacity <= 0) {
      throw new NotFoundError('Classroom is full', [
        {
          path: 'offeredCourse',
          message: "Sorry, the classroom is full. Can't enroll more.",
        },
      ]);
    }

    const student = await StudentModel.findOne({ id: userId })
      .select('_id')
      .session(session);
    if (!student) {
      throw new NotFoundError('Student Not Found', [
        {
          path: 'authorization',
          message: 'It seems you are not authorized. Student not found.',
        },
      ]);
    }

    const isTheStudentEnrolled = await EnrolledCourseModel.findOne({
      semesterRegistration: isOfferedCourseExists.semesterRegistration,
      offeredCourse,
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
