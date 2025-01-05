import { QueryBuilder } from '../../builder/QueryBuilder';
import { ConflictError } from '../../utils/errors/ConflictError';
import { InternalServerError } from '../../utils/errors/InternalServerError';
import { NotFoundError } from '../../utils/errors/NotFoundError';
import { SemesterModel } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistrationModel } from './semesterRegistration.model';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemesterId = payload?.academicSemester;

  const isUpcomingOrOngoingSemExists = await SemesterRegistrationModel.findOne({
    $or: [{ status: 'UPCOMING' }, { status: 'ONGOING' }],
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
  const isSemesterExists = await SemesterRegistrationModel.findById(id);

  if (!isSemesterExists) {
    throw new NotFoundError(`Semester not found with ID: ${id}`, [
      {
        path: 'id',
        message:
          'The specified Academic Semester does not exist in the system. Please check and provide a valid semester ID.',
      },
    ]);
  } else if (isSemesterExists?.status === 'ENDED') {
    throw new ConflictError('Cannot update an ended semester', [
      {
        path: 'status',
        message:
          'The specified Academic Semester has already ended and cannot be updated. Please provide a valid semester ID for a semester that has not ended.',
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

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllRegisteredSemestersFromDB,
  getARegisteredSemesterFromDB,
  updateRegisteredSemesterIntoDB,
};
