import { ConflictError } from '../../utils/errors/ConflictError';
import { InternalServerError } from '../../utils/errors/InternalServerError';
import { NotFoundError } from '../../utils/errors/NotFoundError';
import { SemesterModel } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistrationModel } from './semesterRegistration.model';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemesterId = payload.academicSemester;

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

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
};
