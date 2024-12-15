import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFacultyModel } from './academicFaculty.model';

const createAcademicFacultyIntoDB = async (data: TAcademicFaculty) => {
  const result = await AcademicFacultyModel.create(data);
  return result;
};

export const AcademicFacultyServices = {
  createAcademicFacultyIntoDB,
};
