import { QueryBuilder } from '../../builder/QueryBuilder';
import { InternalServerError } from '../../errors/InternalServerError';
import { NotFoundError } from '../../errors/NotFoundError';
import { ValidationError } from '../../errors/ValidationError';
import { semesterCodeNameMapper } from './academicSemester.constants';
import { TAcademicSemester } from './academicSemester.interface';
import { SemesterModel } from './academicSemester.model';

//creating an academic semester into the DB
const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  const errorSource = [
    {
      path: `${payload.name}`,
      message:
        'The semester name and code must correspond correctly for a valid academic semester.',
    },
    {
      path: `${payload.code}`,
      message:
        'Ensure the semester code is valid and matches the associated name.',
    },
  ];

  //semesterCodeNameMapper is an constant object which is placed in the constant file
  if (semesterCodeNameMapper[payload.name] !== payload.code) {
    throw new ValidationError('Mismatch semester name & code!', errorSource);
  } else {
    const result = await SemesterModel.create(payload);
    if (!result) {
      throw new InternalServerError('Failed to Create Academic Semester', [
        {
          path: 'server',
          message:
            'An unexpected error occurred while creating the academic semester. Please try again later.',
        },
      ]);
    }
    return result;
  }
};

//retrieving all academic semesters from the DB
const getAllAcademicSemestersFromDB = async (
  query: Record<string, unknown>,
) => {
  const searchableFields = ['name', 'code', 'year', 'startMonth', 'endMonth'];

  const academicSemesterQuery = new QueryBuilder(query, SemesterModel.find())
    .search(searchableFields)
    .filter()
    .paginate()
    .sortBy()
    .fields();

  const result = await academicSemesterQuery.modelQuery;
  if (!result.length) {
    throw new NotFoundError(`No semester found.`, [
      {
        path: 'Semester',
        message: 'No semesters are currently available in the system.',
      },
    ]);
  }

  const meta = await academicSemesterQuery.countTotal();

  return { meta, result };
};

//retrieving a single academic semester with id from the DB
const getAnAcademicSemesterFromDB = async (id: string) => {
  const result = await SemesterModel.findById(id);
  if (!result) {
    throw new NotFoundError(`Academic semester not found!`, [
      {
        path: 'Semester',
        message: `Academic semester not found with id: ${id}`,
      },
    ]);
  }

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
    throw new ValidationError(
      "You must provide both 'name' and 'code' together. They are related and cannot be updated independently.",
      [
        {
          path: `${updateData.name}`,
          message: 'Semester name is required when updating.',
        },
        {
          path: `${updateData.code}`,
          message: 'Semester code is required when updating.',
        },
      ],
    );
  }

  // validating the updated data for safety if the user passes invalid semester name or code,
  if (
    updateData.name &&
    updateData.code &&
    semesterCodeNameMapper[updateData.name] !== updateData.code
  ) {
    throw new ValidationError('Mismatch semester name & code!', [
      {
        path: `${updateData.name}`,
        message:
          'The semester name and code must correspond correctly for a valid academic semester.',
      },
      {
        path: `${updateData.code}`,
        message:
          'Ensure the semester code is valid and matches the associated name.',
      },
    ]);
  }

  const result = await SemesterModel.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  //throw error if not found
  if (!result) {
    throw new NotFoundError(`Academic semester not found!`, [
      {
        path: 'Semester',
        message: `Academic semester not found with id: ${id}`,
      },
    ]);
  }

  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  getAnAcademicSemesterFromDB,
  updateAnAcademicSemesterIntoDB,
};
