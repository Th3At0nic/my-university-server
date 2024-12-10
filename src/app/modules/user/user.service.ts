import config from '../../config';
import { TStudent } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { TUser } from './user.interface';
import { UserModel } from './user.model';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  const user: Partial<TUser> = {
    password: password || (config.default_password as string),
    role: 'student',
    id: '2030100001',
  };

  //preventing duplicate creation of student
  const userExisted = await UserModel.isUserExists(user.id as string);
  if (userExisted) {
    throw new Error('The user existed already!');
  }
  //creating a new user
  const newUser = await UserModel.create(user);

  if (Object.keys(newUser).length) {
    studentData.id = newUser.id;
    studentData.user = newUser._id;

    //creating a new student
    const newStudent = await StudentModel.create({
      ...studentData,
      password,
    });
    return newStudent;
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
