/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { NotFoundError } from '../../utils/errors/NotFoundError';
import { TFaculty } from './faculty.interface';
import { FacultyModel } from './faculty.model';
import { UserModel } from '../user/user.model';
import { ConflictError } from '../../utils/errors/ConflictError';

const getAllFacultiesFromDB = async () => {
  const result = await FacultyModel.find();
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
  const result = await FacultyModel.findOne({ id, isDeleted: false });

  if (!result) {
    throw new NotFoundError('Faculty not found!', [
      {
        path: id,
        message: `The faculty with id: ${id} is not be found in the system.`,
      },
    ]);
  }
  return result;
};

const updateFacultyIntoDB = async (
  id: string,
  updateData: Partial<TFaculty>,
) => {
  const result = await FacultyModel.findOneAndUpdate(
    { id, isDeleted: false },
    updateData,
    {
      new: true,
    },
  );
  if (!result) {
    throw new NotFoundError('Faculty not found!', [
      {
        path: id,
        message: `The faculty with id: ${id} is not be found in the system.`,
      },
    ]);
  }
  return result;
};

const deleteFacultyFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const faculty = await FacultyModel.findOne({ id: id, isDeleted: false });

    if (!faculty) {
      throw new NotFoundError(`Faculty member not found!`, [
        {
          path: `${id}`,
          message: `No faculty member found with the provided ID: ${id}. The record may have been deleted or does not exist. Please verify the ID and try again.`,
        },
      ]);
    }

    await UserModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    const result = await FacultyModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!result) {
      throw new ConflictError(`Failed to deleted.`, [
        {
          path: id,
          message: 'Failed to deleted the student. Transaction is aborted.',
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
