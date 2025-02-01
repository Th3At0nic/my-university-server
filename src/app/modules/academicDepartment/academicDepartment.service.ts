import { QueryBuilder } from '../../builder/QueryBuilder';
import { InternalServerError } from '../../errors/InternalServerError';
import { NotFoundError } from '../../errors/NotFoundError';
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model';
import { TAcademicDepartment } from './academicDepartment.interface';
import { DepartmentModel } from './academicDepartment.model';

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const isAcademicFacultyExists = await AcademicFacultyModel.findById(
    payload.academicFaculty,
  );

  if (!isAcademicFacultyExists) {
    throw new NotFoundError('Academic Faculty Not Found', [
      {
        path: 'academicFaculty',
        message:
          'The academic faculty with the provided ID does not exist or is invalid.',
      },
    ]);
  }

  const result = await DepartmentModel.create(payload);

  if (!result) {
    throw new InternalServerError('Department creation failed', [
      {
        path: 'server',
        message:
          'An unexpected error occurred while creating the department. Please try again later.',
      },
    ]);
  }

  const populatedResult = await DepartmentModel.findById(result._id).populate(
    'academicFaculty',
  );
  return populatedResult ? populatedResult : result;
};

const getAllAcademicDepartmentFromDB = async (
  query: Record<string, unknown>,
) => {
  const searchableFields = ['name'];
  const academicDepartmentQuery = new QueryBuilder(
    query,
    DepartmentModel.find().populate('academicFaculty'),
  )
    .search(searchableFields)
    .filter()
    .paginate()
    .sortBy()
    .fields();
  const result = await academicDepartmentQuery.modelQuery;

  if (!result.length) {
    throw new NotFoundError(`Academic department not found!`, [
      {
        path: 'Department',
        message: `No Academic department found.`,
      },
    ]);
  }
  return result;
};

const getAnAcademicDepartmentFromDB = async (id: string) => {
  const result = await DepartmentModel.findById(id).populate('academicFaculty');
  if (!result) {
    throw new NotFoundError(`Academic department not found!`, [
      {
        path: 'Department',
        message: `The Academic department found with id: ${id}.`,
      },
    ]);
  }
  return result;
};

const updateAcademicDepartmentIntoDB = async (
  id: string,
  updateData: Partial<TAcademicDepartment>,
) => {
  if (updateData.academicFaculty) {
    const isAcademicFacultyExists = await AcademicFacultyModel.findById(
      updateData.academicFaculty,
    );

    if (!isAcademicFacultyExists) {
      throw new NotFoundError('Academic Faculty Not Found', [
        {
          path: 'academicFaculty',
          message:
            'The academic faculty with the provided ID does not exist or is invalid.',
        },
      ]);
    }
  }

  const result = await DepartmentModel.findByIdAndUpdate(id, updateData, {
    new: true,
  }).populate('academicFaculty');

  if (!result) {
    throw new NotFoundError(`Academic department not found!`, [
      {
        path: 'Department',
        message: `The Academic department found with id: ${id}.`,
      },
    ]);
  }
  return result;
};

export const AcademicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartmentFromDB,
  getAnAcademicDepartmentFromDB,
  updateAcademicDepartmentIntoDB,
};
