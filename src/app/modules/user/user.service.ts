import mongoose from 'mongoose';
import config from '../../config';
import { TStudent } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import { generateNewStudentId } from './user.utils';

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
      throw new Error('The user existed already!');
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
      const newStudent = await StudentModel.create(
        [
          {
            ...studentData,
            password,
          },
        ],
        { session },
      );

      //this block of code is responsible for providing response data with populated admissionSemester and academicDepartment document
      const populatedNewStudent = await StudentModel.findById([
        newStudent[0]._id,
      ])
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
  } catch (err) {
    await session.abortTransaction();
    throw new Error(
      (err as Error).message || 'Failed to create User and Student',
    );
  } finally {
    session.endSession();
  }

  return 'Something went wrong while creating a new User using UserModel!';

  //creating a static methods for interacting with the db with model before creating/saving into the db
  // if (await StudentModel.isUserExists(studentData.id)) {
  //   throw new Error('User already exists!');
  // }
  // const result = await StudentModel.create(studentData); //built-in static methods of mongoose
  //creating an instance of StudentModel class
  // const student = new StudentModel<TStudent>(studentData);
  // if (await student.isUserExists(studentData.id)) {
  //   throw new Error('User already exists!');
  // }
  // const result = await student.save(); //built-in instance method
  //   return result;
  //both the instance method or static method works same. but static method is directly creating and saving the data in DB by one command or call, where instance method gives flexiblity , like modifying the data before saving into DB
};

export const userServices = {
  createStudentIntoDB,
};
