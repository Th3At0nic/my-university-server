import { TAcademicSemester } from './academicSemester.interface';
import { SemesterModel } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (data: TAcademicSemester) => {
  const result = await SemesterModel.create(data);
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
};
