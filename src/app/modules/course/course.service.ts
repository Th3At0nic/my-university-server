import { QueryBuilder } from '../../builder/QueryBuilder';
import { ConflictError } from '../../utils/errors/ConflictError';
import { NotFoundError } from '../../utils/errors/NotFoundError';
import { TCourse } from './course.interface';
import { CourseModel } from './course.model';

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

  const populatedResult = await CourseModel.findById(result._id).populate(
    'preRequisiteCourses.course',
  );
  return populatedResult;
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
  return result;
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
  const { preRequisiteCourses, ...remainingData } = payload;
  // const updateBasicCourseInfo =
  await CourseModel.findByIdAndUpdate(id, remainingData, {
    new: true,
    runValidators: true,
  });

  if (preRequisiteCourses && preRequisiteCourses.length > 0) {
    const prerequisitesToDelete = preRequisiteCourses
      .filter((el) => el.course && el.isDeleted)
      .map((el) => el.course);

    // const deletePrerequisitesFromDB =
    await CourseModel.findByIdAndUpdate(id, {
      $pull: {
        preRequisiteCourses: { course: { $in: prerequisitesToDelete } },
      },
    });
  }

  const newPreRequisites = preRequisiteCourses?.filter(
    (el) => el.course && !el.isDeleted,
  );

  // const addNewPreRequisiteCourses =
  await CourseModel.findByIdAndUpdate(id, {
    $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
  });

  const result = await CourseModel.findById(id).populate(
    'preRequisiteCourses.course',
  );

  return result;
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

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getACourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
};
