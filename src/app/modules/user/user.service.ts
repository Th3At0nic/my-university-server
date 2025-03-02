/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import config from '../../config';
import { TStudent } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { TChangeStatusData, TUser } from './user.interface';
import { UserModel } from './user.model';
import { generateNewStudentId, generateRoleBasedId } from './user.utils';
import { ConflictError } from '../../errors/ConflictError';
import { FacultyModel } from '../faculty/faculty.model';
import { TFaculty } from '../faculty/faculty.interface';
import { TAdmin } from '../admin/admin.interface';
import { AdminModel } from '../admin/admin.model';
import { USER_ROLE } from './user.constant';
import { InternalServerError } from '../../errors/InternalServerError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { DepartmentModel } from '../academicDepartment/academicDepartment.model';
import { NotFoundError } from '../../errors/NotFoundError';

const createStudentIntoDB = async (
  file: any,
  password: string,
  studentData: TStudent,
) => {
  // creating a mongodb transaction session to create user and student both together, or abort if any one crushes
  const session = await mongoose.startSession();

  try {
    session.startTransaction(); // starting the session for transaction

    const user: Partial<TUser> = {
      password: password || (config.default_password as string),
      role: 'student',
      id: await generateNewStudentId(studentData),
      email: studentData.email,
    };

    //preventing duplicate creation of student
    const userExisted = await UserModel.isUserExists(user.id as string);
    if (userExisted) {
      throw new ConflictError('The user existed already!', [
        {
          path: `${user.id}`,
          message: `The user id: ${user.id} is already registered.`,
        },
      ]);
    }

    const isAcademicDepartmentExists = await DepartmentModel.findById(
      studentData.academicDepartment,
    );

    if (!isAcademicDepartmentExists) {
      throw new NotFoundError('Academic Department Not Found', [
        {
          path: 'academicDepartment',
          message:
            'The academic department with the provided ID does not exist. Please verify the ID and try again.',
        },
      ]);
    }

    //creating a new user
    const newUser = await UserModel.create([user], { session });

    if (newUser.length) {
      //student id format : year/semesterCode/id
      studentData.id = newUser[0].id;

      studentData.user = newUser[0]._id;

      studentData.academicFaculty = isAcademicDepartmentExists.academicFaculty;

      studentData.isDeleted = newUser[0].isDeleted;

      //naming the given img from user, and then uploading it to cloudinary and then passing the imgURL to the studentData to keep in mongoDB

      if (file?.path) {
        const imgName = `${user.id}${studentData.name.firstName}`;
        const imgPath = file?.path;
        const uploadImgResult = await sendImageToCloudinary(imgPath, imgName);

        studentData.profileImg = uploadImgResult?.secure_url as string;
      }

      //creating a new student
      const newStudent = await StudentModel.create([studentData], {
        session,
      });

      //this block of code is responsible for providing response data with populated admissionSemester and academicDepartment document
      const populatedNewStudent = await StudentModel.findById(newStudent[0]._id)
        .populate('admissionSemester')
        .populate('user')
        .populate({
          path: 'academicDepartment',
          populate: {
            path: 'academicFaculty',
          },
        })
        .session(session);

      await session.commitTransaction();

      return populatedNewStudent;
    }
  } catch (err: any) {
    await session.abortTransaction();
    if (err.code === 11000) {
      // Extracting the conflicting field
      const duplicateField = Object.keys(err.keyValue)[0]; // e.g., 'email'
      const duplicateValue = err.keyValue[duplicateField]; // e.g., 'john.kr7@example.com'

      throw new ConflictError('Duplicate Key Error!', [
        {
          path: duplicateField,
          message: `The ${duplicateField} '${duplicateValue}' already exists. Please use a different ${duplicateField}.`,
        },
      ]);
    }
    throw err;
  } finally {
    session.endSession();
  }

  return 'Something went wrong while creating a new User using UserModel!';
};

//
//
//creating faculty in the db as well as user together
const createFacultyIntoDB = async (
  file: any,
  password: string,
  facultyData: TFaculty,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const user: Partial<TUser> = {
      password: password || (config.default_password as string),
      role: 'faculty',
      id: await generateRoleBasedId('faculty'),
      email: facultyData.email,
    };

    const isAcademicDepartmentExists = await DepartmentModel.findById(
      facultyData.academicDepartment,
    );

    if (!isAcademicDepartmentExists) {
      throw new NotFoundError('Academic Department Not Found', [
        {
          path: 'academicDepartment',
          message:
            'The academic department with the provided ID does not exist. Please verify the ID and try again.',
        },
      ]);
    }

    const newUser = await UserModel.create([user], { session });

    if (newUser.length) {
      //assigning faculty id and user from the user id
      facultyData.id = newUser[0].id;

      facultyData.user = newUser[0]._id;

      facultyData.academicFaculty = isAcademicDepartmentExists.academicFaculty;

      facultyData.isDeleted = newUser[0].isDeleted;

      //naming the given img from user, and then uploading it to cloudinary and then passing the imgURL to the studentData to keep in mongoDB
      if (file?.path) {
        const imgName = `${user.id}${facultyData.name.firstName}`;
        const imgPath = file.path;
        const uploadImgResult = await sendImageToCloudinary(imgPath, imgName);

        facultyData.profileImage = uploadImgResult?.secure_url as string;
      }

      const newFaculty = await FacultyModel.create([facultyData], { session });

      const populatedNewFaculty = await FacultyModel.findById(newFaculty[0]._id)
        .populate('academicFaculty')
        .populate('user')
        .populate({
          path: 'academicDepartment',
          populate: {
            path: 'academicFaculty',
          },
        })
        .session(session);

      await session.commitTransaction();

      return populatedNewFaculty;
    }
  } catch (err: any) {
    await session.abortTransaction();

    if (err.code === 11000) {
      // Extracting the conflicting field
      const duplicateField = Object.keys(err.keyValue)[0]; // e.g., 'email'
      const duplicateValue = err.keyValue[duplicateField]; // e.g., 'john.kr7@example.com'

      throw new ConflictError('Duplicate Key Error!', [
        {
          path: duplicateField,
          message: `The ${duplicateField} '${duplicateValue}' already exists. Please use a different ${duplicateField}.`,
        },
      ]);
    }
    throw err;
  } finally {
    session.endSession();
  }
  return 'Something went wrong while creating a new User using UserModel!';
};

//
//
//creating faculty in the db as well as user together
const createAdminIntoDB = async (
  file: any,
  password: string,
  adminData: TAdmin,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const user: Partial<TUser> = {
      password: password || (config.default_password as string),
      role: 'admin',
      id: await generateRoleBasedId('admin'),
      email: adminData.email,
    };

    const isAcademicDepartmentExists = await DepartmentModel.findById(
      adminData.managementDepartment,
    );

    if (!isAcademicDepartmentExists) {
      throw new NotFoundError('Academic Department Not Found', [
        {
          path: 'academicDepartment',
          message:
            'The academic department with the provided ID does not exist. Please verify the ID and try again.',
        },
      ]);
    }

    const newUser = await UserModel.create([user], { session });

    if (newUser.length) {
      //assigning faculty id and user from the user id
      adminData.id = newUser[0].id;

      adminData.user = newUser[0]._id;

      adminData.isDeleted = newUser[0].isDeleted;

      //naming the given img from user, and then uploading it to cloudinary and then passing the imgURL to the studentData to keep in mongoDB
      if (file?.path) {
        const imgName = `${user.id}${adminData.name.firstName}`;
        const imgPath = file.path;
        const uploadImgResult = await sendImageToCloudinary(imgPath, imgName);

        adminData.profileImage = uploadImgResult?.secure_url as string;
      }

      const newAdmin = await AdminModel.create([adminData], { session });

      const populatedNewAdmin = await AdminModel.findById(newAdmin[0]._id)
        .populate('managementDepartment')
        .populate('user')
        .session(session);

      await session.commitTransaction();

      return populatedNewAdmin;
    }
  } catch (err: any) {
    await session.abortTransaction();
    if (err.code === 11000) {
      // Extracting the conflicting field
      const duplicateField = Object.keys(err.keyValue)[0]; // e.g., 'email'
      const duplicateValue = err.keyValue[duplicateField]; // e.g., 'john.kr7@example.com'

      throw new ConflictError('Duplicate User Error!', [
        {
          path: duplicateField,
          message: `The ${duplicateField} '${duplicateValue}' already exists. Please use a different ${duplicateField}.`,
        },
      ]);
    }
    throw err;
  } finally {
    session.endSession();
  }
  return 'Something went wrong while creating a new User using UserModel!';
};

const getMyDataFromDB = async (userId: string, role: string) => {
  let result = null;

  if (role === USER_ROLE.admin) {
    result = await AdminModel.findOne({
      id: userId,
    });
  } else if (role === USER_ROLE.faculty) {
    result = await FacultyModel.findOne({
      id: userId,
    });
  } else if (role === USER_ROLE.student) {
    result = await StudentModel.findOne({
      id: userId,
    });
  }

  return result;
};

const changeUserStatusIntoDB = async (
  userId: string,
  payload: TChangeStatusData,
) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new NotFoundError('User Not Found!', [
      {
        path: 'id',
        message: `The User with the provided ID: ${userId} not found in the system. Please recheck the ID and try again`,
      },
    ]);
  }

  const isUserDeleted = user?.isDeleted;
  if (isUserDeleted) {
    throw new NotFoundError('User Not Found!', [
      {
        path: 'id',
        message: `The User with the provided ID: ${userId} not found in the system. Please recheck the ID and try again`,
      },
    ]);
  }

  const result = await UserModel.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new InternalServerError(`Internal Server Error`, [
      {
        path: 'status',
        message: `Something went wrong. Couldn't change the user status`,
      },
    ]);
  }
  return result;
};

export const userServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMyDataFromDB,
  changeUserStatusIntoDB,
};
