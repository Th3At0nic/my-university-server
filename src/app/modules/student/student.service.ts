import { TStudent } from './student.interface';
import { StudentModel } from './student.model';

const createStudentIntoDB = async (studentData: TStudent) => {
  //creating a static methods for interacting with the db with model before creating/saving into the db
  if (await StudentModel.isUserExists(studentData.id)) {
    throw new Error('User already exists!');
  }
  const result = await StudentModel.create(studentData); //built-in static methods of mongoose

  //creating an instance of StudentModel class
  // const student = new StudentModel<TStudent>(studentData);

  // if (await student.isUserExists(studentData.id)) {
  //   throw new Error('User already exists!');
  // }

  // const result = await student.save(); //built-in instance method
  return result;

  //both the instance method or static method works same. but static method is directly creating and saving the data in DB by one command or call, where instance method gives flexiblity , like modifying the data before saving into DB
};

const getAllStudentsFromDB = async () => {
  const result = await StudentModel.find(); //built-in static methods of mongoose
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await StudentModel.findOne({ id }); //built-in static methods of mongoose
  return result;
};

export const studentService = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
};
