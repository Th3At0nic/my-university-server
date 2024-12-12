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

//updating a semester into the DB
const updateAnAcademicSemesterIntoDB = async (
  id: string,
  updateData: Partial<TAcademicSemester>,
) => {
  //enforcing user to pass both name and code together to ensure safety
  if (
    (updateData.name && !updateData.code) ||
    (!updateData.name && updateData.code)
  ) {
    throw new Error(
      "You must provide both 'name' and 'code' together. They are related and cannot be updated independently.",
    );
  }
  // validating the updated data for safety if the user passes invalid semester name or code,
  if (
    updateData.name &&
    updateData.code &&
    semesterCodeNameMapper[updateData.name] !== updateData.code
  ) {
    throw new Error('Mismatch semester name & code!');
  }

  const result = await SemesterModel.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  getAnAcademicSemesterFromDB,
  updateAnAcademicSemesterIntoDB,
};
