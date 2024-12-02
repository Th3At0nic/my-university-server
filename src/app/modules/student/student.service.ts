import { TStudent } from './student.interface';
import { StudentModel } from './student.model';

const createStudentIntoDB = async (studentData: TStudent) => {
  // const result = await StudentModel.create(student); //built-in static methods of mongoose

  const student = new StudentModel<TStudent>(studentData); //creating an instance of StudentModel class

  if (await student.isUserExists(studentData.id)) {
    throw new Error('User already exists!');
  }

  const result = await student.save(); //built-in instance method
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
