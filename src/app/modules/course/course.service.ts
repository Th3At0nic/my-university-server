import mongoose from 'mongoose';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { ConflictError } from '../../errors/ConflictError';
import { NotFoundError } from '../../errors/NotFoundError';
import { TCourse, TCourseFaculty } from './course.interface';
import { CourseFacultyModel, CourseModel } from './course.model';
import { InternalServerError } from '../../errors/InternalServerError';

const createCourseIntoDB = async (payload: TCourse) => {
  const isCourseExists = await CourseModel.findOne({
    title: payload.title,
    code: payload.code,
  });

  if (isCourseExists && !isCourseExists?.isDeleted) {
    throw new ConflictError(`The course is already exists`, [
      {
        path: `payload.title & payload.code`,
        message: `The course with title: ${payload.title} & code: ${payload.code} is already exists`,
      },
    ]);
  }

  const result = await CourseModel.create(payload);

  if (!result) {
    throw new InternalServerError('Failed to Create the course', [
      {
        path: 'server',
        message:
          'An unexpected error occurred while creating the course. Please try again later.',
      },
    ]);
  }

  const populatedResult = await CourseModel.findById(result._id).populate(
    'preRequisiteCourses.course',
  );
  return populatedResult ? populatedResult : result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const searchableFields = ['title', 'prefix'];
  const courseQuery = new QueryBuilder(
    query,
    CourseModel.find().populate('preRequisiteCourses.course'),
  )
    .search(searchableFields)
    .filter()
    .sortBy()
    .paginate()
    .fields();

  const result = await courseQuery.modelQuery;
  if (!result.length) {
    throw new NotFoundError('No Courses found!', [
      {
        path: 'Courses',
        message: 'No courses found at the moment!',
      },
    ]);
  }
  const meta = await courseQuery.countTotal();
  return { meta, result };
};

const getACourseFromDB = async (id: string) => {
  const result = await CourseModel.findById(id).populate(
    'preRequisiteCourses.course',
  );
  if (!result) {
    throw new NotFoundError('Course not found!', [
      {
        path: 'id',
        message: `The course not found with the id: ${id}`,
      },
    ]);
  }
  return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { preRequisiteCourses, ...remainingData } = payload;
    const updatedCourse = await CourseModel.findByIdAndUpdate(
      id,
      remainingData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );
    if (!updatedCourse) {
      throw new NotFoundError('Course not found', [
        {
          path: 'id',
          message: `Course not found with the id : ${id} or something went wrong to update`,
        },
      ]);
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const prerequisitesToDelete = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);

      const deletedPrerequisites = await CourseModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: prerequisitesToDelete } },
          },
        },
        { new: true, runValidators: true, session },
      );
      if (!deletedPrerequisites) {
        throw new ConflictError('Failed to delete prerequisites', [
          {
            path: 'preRequisiteCourses',
            message: 'Could not remove specified preRequisites.',
          },
        ]);
      }
    }

    const newPreRequisites = preRequisiteCourses?.filter(
      (el) => el.course && !el.isDeleted,
    );

    const addNewPreRequisites = await CourseModel.findByIdAndUpdate(
      id,
      {
        $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
      },
      { new: true, runValidators: true, session },
    );
    if (!addNewPreRequisites) {
      throw new ConflictError('Failed to add new prerequisites', [
        {
          path: 'preRequisiteCourses',
          message: 'Could not add new preRequisites.',
        },
      ]);
    }

    const result = await CourseModel.findById(id).populate(
      'preRequisiteCourses.course',
    );
    if (!result) {
      throw new NotFoundError('Updated course not found', [
        {
          path: 'id',
          message: `Unable to find updated course with ID: ${id}.`,
        },
      ]);
    }

    await session.commitTransaction();
    return result;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const deleteCourseFromDB = async (id: string) => {
  const isCourseDeleted = await CourseModel.findById(id);

  if (isCourseDeleted?.isDeleted) {
    throw new NotFoundError(
      `The course is not found or has already been deleted`,
      [
        {
          path: 'id',
          message: `The course with id: ${id} does not exist or has already been deleted.`,
        },
      ],
    );
  }

  const result = await CourseModel.findByIdAndUpdate(id, { isDeleted: true });
  if (!result) {
    throw new NotFoundError('Course not found!', [
      {
        path: 'id',
        message: `The course not found with the id: ${id}`,
      },
    ]);
  }
  return result;
};

const assignFacultiesToCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    },
  );
  if (!result) {
    throw new NotFoundError('Course not found!', [
      {
        path: 'id',
        message: `The course not found with the id: ${id}`,
      },
    ]);
  }

  const populatedResult = await CourseFacultyModel.findById(
    result._id,
  ).populate(['course', 'faculties']);

  return populatedResult;
};

const removeFacultiesFromCourseFromDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    {
      new: true,
      runValidators: true,
    },
  );
  if (!result) {
    throw new NotFoundError('Course not found!', [
      {
        path: 'id',
        message: `The course not found with the id: ${id}`,
      },
    ]);
  }

  const populatedResult = await CourseFacultyModel.findById(
    result._id,
  ).populate(['course', 'faculties']);

  return populatedResult;
};

const getFacultiesWithCourseFromDB = async (courseId: string) => {
  const result = await CourseFacultyModel.findOne({
    course: courseId,
  })
    .populate('course')
    .populate('faculties');

  if (!result) {
    throw new NotFoundError('Faculties Not Found', [
      {
        path: 'course',
        message:
          'No faculties are assigned to the provided course ID. Please verify the course ID and try again.',
      },
    ]);
  }

  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getACourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
  assignFacultiesToCourseIntoDB,
  removeFacultiesFromCourseFromDB,
  getFacultiesWithCourseFromDB,
};
