import mongoose from 'mongoose';
import { NotFoundError } from '../../middlewares/globalErrorHandler';
import { StudentModel } from './student.model';
import { UserModel } from '../user/user.model';
import { TStudent } from './student.interface';

const getAllStudentsFromDB = async () => {
  const result = await StudentModel.find({ isDeleted: false }).populate([
    'admissionSemester',
    {
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    },
  ]);

  if (!result.length) {
    throw new NotFoundError('No Student collection found.');
  }
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await StudentModel.findOne({ id, isDeleted: false }).populate([
    'admissionSemester',
    {
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    },
  ]);

  if (!result) {
    throw new NotFoundError(`Student not found with the id: ${id}`);
  }

  // const result = await StudentModel.aggregate([{ $match: { id: id } }]);

  // this job can be done with both findOne and aggregate, so commented out any one!. remember, each process needs dedicated code block in the model (mongoose middleware)
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const student = await StudentModel.findOne({
      id: id,
      isDeleted: false,
    });

    if (!student) {
      throw new NotFoundError(
        `The student you are trying to delete (id: ${id}) does not exist or has already been deleted.`,
      );
    }

    await UserModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      {
        new: true,
        session,
      },
    );

    const result = await StudentModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    await session.commitTransaction();

    return result;
  } catch (err) {
    await session.abortTransaction();
    throw new Error((err as Error).message);
  } finally {
    session.endSession();
  }
};

const updateStudentIntoDB = async (
  id: string,
  updatedData: Partial<TStudent>,
) => {
  const student = await StudentModel.findOne({ id });
  if (!student || student.isDeleted) {
    throw new NotFoundError(
      `The student you are trying to update (id: ${id}) does not exist or has already been deleted.`,
    );
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

  const result = await StudentModel.findOneAndUpdate({ id }, flattenedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const studentService = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB,
};
