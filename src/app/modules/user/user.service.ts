/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import config from '../../config';
import { TStudent } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import { generateNewStudentId, generateRoleBasedId } from './user.utils';
import { ConflictError } from '../../utils/errors/ConflictError';
import { FacultyModel } from '../faculty/faculty.model';
import { TFaculty } from '../faculty/faculty.interface';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  // creating a mongodb transaction session to create user and student both together, or abort if any one crushes
  const session = await mongoose.startSession();

  try {
    session.startTransaction(); // starting the session for transaction

    const user: Partial<TUser> = {
      password: password || (config.default_password as string),
      role: 'student',
      id: await generateNewStudentId(studentData),
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
    //creating a new user
    const newUser = await UserModel.create([user], { session });

    if (newUser.length) {
      //student id format : year/semesterCode/id
      studentData.id = newUser[0].id;
      // studentData.id = generateId(studentData);

      studentData.user = newUser[0]._id;

      studentData.isDeleted = newUser[0].isDeleted;

      //creating a new student
      const newStudent = await StudentModel.create([studentData], {
        session,
      });

      //this block of code is responsible for providing response data with populated admissionSemester and academicDepartment document
      const populatedNewStudent = await StudentModel.findById(newStudent[0]._id)
        .populate('admissionSemester')
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
  } finally {
    session.endSession();
  }

  return 'Something went wrong while creating a new User using UserModel!';
};

//
//
//creating faculty in the db as well as user together
const createFacultyIntoDB = async (password: string, facultyData: TFaculty) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const user: Partial<TUser> = {
      password: password || (config.default_password as string),
      role: 'faculty',
      id: await generateRoleBasedId(facultyData, 'faculty'),
      //first parameter should be data and second should be determine role to create different id
    };

    const newUser = await UserModel.create([user], { session });

    if (newUser.length) {
      //assigning faculty id and user from the user id
      facultyData.id = newUser[0].id;

      facultyData.user = newUser[0]._id;

      facultyData.isDeleted = newUser[0].isDeleted;

      const newFaculty = await FacultyModel.create([facultyData], { session });

      const populatedNewFaculty = await FacultyModel.findById(newFaculty[0]._id)
        .populate('academicFaculty')
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
  } finally {
    session.endSession();
  }
  return 'Something went wrong while creating a new User using UserModel!';
};

export const userServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
};
