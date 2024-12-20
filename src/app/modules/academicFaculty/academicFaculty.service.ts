import { NotFoundError } from '../../utils/errors/notFoundError';
import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFacultyModel } from './academicFaculty.model';

const createAcademicFacultyIntoDB = async (data: TAcademicFaculty) => {
  const result = await AcademicFacultyModel.create(data);
  return result;
};

const getAllAcademicFacultyFromDB = async () => {
  const result = await AcademicFacultyModel.find();
  if (!result) {
    throw new NotFoundError(`No Academic Faculty found`, [
      {
        path: `academic faculty`,
        message: `No academic faculty found in the system.`,
      },
    ]);
  }
  return result;
};

const getAnAcademicFacultyFromDB = async (id: string) => {
  const result = await AcademicFacultyModel.findById(id);
  if (!result) {
    throw new NotFoundError(`Academic Faculty not found`, [
      {
        path: `${id}`,
        message: `Academic faculty with id: ${id} not found in the system.`,
      },
    ]);
  }
  return result;
};

const updateAcademicFacultyIntoDB = async (
  id: string,
  updatedData: Partial<TAcademicFaculty>,
) => {
  const result = await AcademicFacultyModel.findByIdAndUpdate(id, updatedData, {
    new: true,
  });
  if (!result) {
    throw new NotFoundError(`Academic Faculty not found`, [
      {
        path: `${id}`,
        message: `Academic faculty with id: ${id} not found in the system.`,
      },
    ]);
  }
  return result;
};

export const AcademicFacultyServices = {
  createAcademicFacultyIntoDB,
  getAllAcademicFacultyFromDB,
  getAnAcademicFacultyFromDB,
  updateAcademicFacultyIntoDB,
};
