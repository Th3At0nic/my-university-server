import { NotFoundError } from '../../utils/errors/NotFoundError';
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

export const FacultyServices = {
  getAllFacultiesFromDB,
};
