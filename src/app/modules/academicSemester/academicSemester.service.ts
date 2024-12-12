import { semesterCodeNameMapper } from './academicSemester.constants';
import { TAcademicSemester } from './academicSemester.interface';
import { SemesterModel } from './academicSemester.model';

//creating an academic semester into the DB
const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  //semesterCodeNameMapper is an constant object placed in the constant file
  if (semesterCodeNameMapper[payload.name] !== payload.code) {
    throw new Error('Mismatch semester name & code!');
  } else {
    const result = await SemesterModel.create(payload);
    return result;
  }
};

//retrieving all academic semesters from the DB
const getAllAcademicSemestersFromDB = async () => {
  const result = await SemesterModel.find();
  return result;
};

//retrieving a single academic semester with id from the DB
const getAnAcademicSemesterFromDB = async (id: string) => {
  const result = await SemesterModel.findById(id);
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  getAnAcademicSemesterFromDB,
};
