import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import { UserModel } from '../user/user.model';
import { TStudent } from './student.interface';
import { NotFoundError } from '../../utils/errors/NotFoundError';
import { ConflictError } from '../../utils/errors/ConflictError';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constants';

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  //applying all query methods by chaining , by creating an instance of the QueryBuilder class
  const studentQuery = new QueryBuilder(
    query,
    StudentModel.find().populate([
      'admissionSemester',
      {
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      },
    ]),
  )
    .search(studentSearchableFields)
    .filter()
    .sortBy()
    .paginate()
    .fields();

  // now assigning the result of instance class into the result const
  const result = await studentQuery.modelQuery;

  if (!result.length) {
    throw new NotFoundError('No Student found.', [
      {
        path: 'Students',
        message: 'The student collection could not be found in the system.',
      },
    ]);
  }
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await StudentModel.findById(id).populate([
    'admissionSemester',
    {
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    },
  ]);

  if (!result) {
    throw new NotFoundError(`Student not found!`, [
      {
        path: `${id}`,
        message: `No student found with the provided ID: ${id}. Please check the ID and try again.`,
      },
    ]);
  }

  // const result = await StudentModel.aggregate([{ $match: { id: id } }]);

  // this job can be done with both findOne and aggregate, so commented out any one!. remember, each process needs dedicated code block in the model (mongoose middleware)
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const student = await StudentModel.findById(id);

    if (!student || student.isDeleted) {
      throw new NotFoundError(`Student not found!`, [
        {
          path: `${id}`,
          message: `No student found with the provided ID: ${id}. The record may have been deleted or does not exist. Please check the ID and try again.`,
        },
      ]);
    }

    await UserModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      {
        new: true,
        session,
      },
    );

    const result = await StudentModel.findByIdAndUpdate(
      id,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const updateStudentIntoDB = async (
  id: string,
  updatedData: Partial<TStudent>,
) => {
  const student = await StudentModel.findByIdAndUpdate(id);
  if (!student || student.isDeleted) {
    throw new NotFoundError(`Student not found!`, [
      {
        path: `${id}`,
        message: `No student found with the provided ID: ${id}. Please check the ID and try again.`,
      },
    ]);
  }

  const { name, guardian, localGuardian, ...remainingData } = updatedData;

  const flattenedData: Record<string, unknown> = { ...remainingData };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      flattenedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      flattenedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      flattenedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await StudentModel.findByIdAndUpdate(id, flattenedData, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ConflictError(`Failed to update.`, [
      {
        path: id,
        message:
          'Failed to update the student. Please check your id and data and try again.',
      },
    ]);
  }

  return result;
};

export const studentService = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB,
};
