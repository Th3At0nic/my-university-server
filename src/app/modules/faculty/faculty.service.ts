import { NotFoundError } from '../../utils/errors/NotFoundError';
import { TFaculty } from './faculty.interface';
import { FacultyModel } from './faculty.model';

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

export const FacultyServices = {
  getAllFacultiesFromDB,
  getAFacultyFromDB,
  updateFacultyIntoDB,
};
