import { semesterCodeNameMapper } from './academicSemester.constants';
import { TAcademicSemester } from './academicSemester.interface';
import { SemesterModel } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  //semesterCodeNameMapper is an constant object placed in the constant file
  if (semesterCodeNameMapper[payload.name] !== payload.code) {
    throw new Error('Mismatch semester name & code!');
  } else {
    const result = await SemesterModel.create(payload);
    return result;
  }
};

const getAllAcademicSemestersFromDB = async () => {
  const result = await SemesterModel.find();
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
};
