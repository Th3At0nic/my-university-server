/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { NotFoundError } from '../../utils/errors/NotFoundError';
import { TFaculty } from './faculty.interface';
import { FacultyModel } from './faculty.model';
import { UserModel } from '../user/user.model';
import { ConflictError } from '../../utils/errors/ConflictError';
import { QueryBuilder } from '../../builder/QueryBuilder';

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const searchableFields = [
    'id',
    'name',
    'contactNo',
    'gender',
    'designation',
    'permanentAddress',
    'presentAddress',
  ];
  const facultyQuery = new QueryBuilder(
    query,
    FacultyModel.find()
      .populate('academicFaculty')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
  )
    .search(searchableFields)
    .filter()
    .paginate()
    .sortBy()
    .fields();
  const result = await facultyQuery.modelQuery;
  if (!result.length) {
    throw new NotFoundError('No Faculty found.', [
      {
        path: 'Faculties',
        message: 'The faculty collection could not be found in the system.',
      },
    ]);
  }
  return result;
};

const getAFacultyFromDB = async (id: string) => {
  const result = await FacultyModel.findById(id);

  if (!result) {
    throw new NotFoundError('Faculty not found!', [
      {
        path: id,
        message: `The faculty with id: ${id} is not found in the system.`,
      },
    ]);
  }
  return result;
};

const updateFacultyIntoDB = async (
  id: string,
  updateData: Partial<TFaculty>,
) => {
  const faculty = await FacultyModel.findById(id);
  if (!faculty) {
    throw new NotFoundError('Faculty not found!', [
      {
        path: id,
        message: `The faculty with id: ${id} is not found in the system.`,
      },
    ]);
  }

  const { name, ...remainingData } = updateData;

  const flattenedData: Record<string, unknown> = { ...remainingData };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      flattenedData[`name.${key}`] = value;
    }
  }

  const result = await FacultyModel.findByIdAndUpdate(id, flattenedData, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new ConflictError('Could not update faculty!', [
      {
        path: id,
        message: `The faculty with id: ${id} couldn't be updated. Please check you ID and data and try again.`,
      },
    ]);
  }
  return result;
};

const deleteFacultyFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const faculty = await FacultyModel.findById(id);

    if (!faculty) {
      throw new NotFoundError(`Faculty member not found!`, [
        {
          path: `${id}`,
          message: `No faculty member found with the provided ID: ${id}. The record may have been deleted or does not exist. Please verify the ID and try again.`,
        },
      ]);
    }

    await UserModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    const result = await FacultyModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!result) {
      throw new ConflictError(`Failed to deleted.`, [
        {
          path: id,
          message: 'Failed to deleted the faculty. Transaction is aborted.',
        },
      ]);
    }

    await session.commitTransaction();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

export const FacultyServices = {
  getAllFacultiesFromDB,
  getAFacultyFromDB,
  updateFacultyIntoDB,
  deleteFacultyFromDB,
};
