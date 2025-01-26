import mongoose from 'mongoose';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { ConflictError } from '../../errors/ConflictError';
import { InternalServerError } from '../../errors/InternalServerError';
import { NotFoundError } from '../../errors/NotFoundError';
import { SemesterModel } from '../academicSemester/academicSemester.model';
import { OfferedCourseModel } from '../offeredCourse/offeredCourse.model';
import { registrationStatus } from './semesterRegistration.constant';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistrationModel } from './semesterRegistration.model';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemesterId = payload?.academicSemester;

  const isUpcomingOrOngoingSemExists = await SemesterRegistrationModel.findOne({
    $or: [
      { status: registrationStatus.UPCOMING },
      { status: registrationStatus.ONGOING },
    ],
  });

  if (isUpcomingOrOngoingSemExists) {
    throw new ConflictError(` Semester registration conflict`, [
      {
        path: 'status',
        message: `An ${isUpcomingOrOngoingSemExists.status} semester registration already exists. Complete or end the current registration before creating a new one.`,
      },
    ]);
  }

  const isSemesterExists = await SemesterModel.findById(academicSemesterId);
  if (!isSemesterExists) {
    throw new NotFoundError('Academic Semester Not Found', [
      {
        path: 'academicSemester',
        message:
          'The specified Academic Semester does not exist in the system. Please verify and provide a valid Academic Semester ID.',
      },
    ]);
  }

  const isSemesterRegistered = await SemesterRegistrationModel.findOne({
    academicSemesterId,
  });
  if (isSemesterRegistered) {
    throw new ConflictError('Duplicate Semester Registration', [
      {
        path: 'academicSemester',
        message:
          'The specified Academic Semester is already registered. Duplicate registrations are not allowed.',
      },
    ]);
  }

  const result = await SemesterRegistrationModel.create(payload);

  if (!result) {
    throw new InternalServerError(
      `Failed to register the semester due to an unexpected server issue.`,
      [
        {
          path: 'academicSemester',
          message:
            'An unexpected error occurred while processing your request. Please try again later or contact support if the issue persists.',
        },
      ],
    );
  }

  const populatedResult = await SemesterRegistrationModel.findById(
    result._id,
  ).populate('academicSemester');

  return populatedResult;
};

const getAllRegisteredSemestersFromDB = async (
  query: Record<string, unknown>,
) => {
  const searchableFields = ['status'];
  const semesterRegistrationQuery = new QueryBuilder(
    query,
    SemesterRegistrationModel.find().populate('academicSemester'),
  )
    .search(searchableFields)
    .filter()
    .sortBy()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;

  if (!result.length) {
    throw new NotFoundError('Semester Registration Not Found', [
      {
        path: 'Semester Registration',
        message: `No semester registration found. Please try again.`,
      },
    ]);
  }
  return result;
};

const getARegisteredSemesterFromDB = async (id: string) => {
  const result = await SemesterRegistrationModel.findById(id);
  if (!result) {
    throw new NotFoundError('Semester Registration Not Found', [
      {
        path: 'id',
        message: `No semester registration found with the provided ID: ${id}. Please ensure the ID is correct and try again.`,
      },
    ]);
  }
  return result;
};

const updateRegisteredSemesterIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  const requestedStatus = payload.status;

  const isSemesterExists = await SemesterRegistrationModel.findById(id);

  const currentSemesterStatus = isSemesterExists?.status;

  if (!isSemesterExists) {
    throw new NotFoundError(`Semester not found with ID: ${id}`, [
      {
        path: 'id',
        message:
          'The specified Semester is not registered in the system. Please check and provide a valid semester ID.',
      },
    ]);
  } else if (currentSemesterStatus === registrationStatus.ENDED) {
    throw new ConflictError('Cannot update an ended semester', [
      {
        path: 'status',
        message:
          'The specified Registered Semester has already ended and cannot be updated. Please provide a valid semester ID for a semester that has not ended.',
      },
    ]);
  }

  if (
    (currentSemesterStatus === registrationStatus.UPCOMING &&
      requestedStatus === registrationStatus.ENDED) ||
    //using both logic with OR and avoiding using else if method, reduce codes
    (currentSemesterStatus === registrationStatus.ONGOING &&
      requestedStatus === registrationStatus.UPCOMING)
  ) {
    throw new ConflictError('Invalid status transition', [
      {
        path: 'status',
        message: `The status flow is invalid. An ${currentSemesterStatus} semester cannot be directly transitioned to ${requestedStatus}. The status must follow the sequence: UPCOMING → ONGOING → ENDED.`,
      },
    ]);
  }

  const result = await SemesterRegistrationModel.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true },
  );

  return result;
};

const deleteRegisteredSemesterFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const isSemesterExists =
      await SemesterRegistrationModel.findById(id).session(session);

    if (!isSemesterExists) {
      throw new NotFoundError(
        `Semester Registration not found with ID: ${id}`,
        [
          {
            path: 'id',
            message:
              'The specified Semester is not registered in the system. Please check and provide a valid semester ID.',
          },
        ],
      );
    }

    const currentSemesterStatus = isSemesterExists?.status;
    if (currentSemesterStatus !== registrationStatus.UPCOMING) {
      throw new ConflictError('Deletion Not Allowed', [
        {
          path: 'status',
          message: `The registered semester cannot be deleted because its status is "${currentSemesterStatus}". Only semesters with the status "UPCOMING" are eligible for deletion.`,
        },
      ]);
    }

    const deleteAllAssociatedOfferedCourse =
      await OfferedCourseModel.deleteMany(
        {
          semesterRegistration: id,
        },
        { session },
      );
    if (deleteAllAssociatedOfferedCourse.deletedCount === 0) {
      throw new NotFoundError('No Offered Courses Found', [
        {
          path: 'semesterRegistration',
          message: `No offered courses were found associated with the registered semester ID: ${id}. Deletion failed.`,
        },
      ]);
    }

    const result = await SemesterRegistrationModel.findByIdAndDelete(id, {
      session,
    });

    if (!result) {
      throw new NotFoundError('Registered Semester Not Found', [
        {
          path: 'id',
          message: `No registered semester found with the provided ID: ${id}. Deletion failed.`,
        },
      ]);
    }
    await session.commitTransaction();
    return result;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllRegisteredSemestersFromDB,
  getARegisteredSemesterFromDB,
  updateRegisteredSemesterIntoDB,
  deleteRegisteredSemesterFromDB,
};
