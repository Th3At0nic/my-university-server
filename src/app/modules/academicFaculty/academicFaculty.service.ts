import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFacultyModel } from './academicFaculty.model';

const createAcademicFacultyIntoDB = async (data: TAcademicFaculty) => {
  const result = await AcademicFacultyModel.create(data);
  return result;
};

const getAllAcademicFacultyFromDB = async () => {
  const result = await AcademicFacultyModel.find();
  return result;
};

const getAnAcademicFacultyFromDB = async (id: string) => {
  const result = await AcademicFacultyModel.findById(id);
  return result;
};

const updateAcademicFacultyIntoDB = async (
  id: string,
  updatedData: Partial<TAcademicFaculty>,
) => {
  const result = await AcademicFacultyModel.findByIdAndUpdate(id, updatedData, {
    new: true,
  });
  return result;
};

export const AcademicFacultyServices = {
  createAcademicFacultyIntoDB,
  getAllAcademicFacultyFromDB,
  getAnAcademicFacultyFromDB,
  updateAcademicFacultyIntoDB,
};
