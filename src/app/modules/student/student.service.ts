import { StudentModel } from './student.model';

const getAllStudentsFromDB = async () => {
  const result = await StudentModel.find(); //built-in static methods of mongoose
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await StudentModel.findOne({ id }); //built-in static methods of mongoose

  // const result = await StudentModel.aggregate([{ $match: { id: id } }]);

  // this job can be done with both findOne and aggregate, so commented out any one!. remember, each process needs dedicated code block in the model (mongoose middleware)
  return result;
};

// update section code doesnot work now, need to fix later
// const updateStudentIntoDB = async (
//   id: string,
//   updateData: Partial<TStudent>,
// ) => {
//   const result = StudentModel.updateOne({ id }, updateData, {
//     runValidators: true,
//   });
//   return result;
// };

const deleteStudentFromDB = async (id: string) => {
  const result = await StudentModel.updateOne({ id }, { isDeleted: true });
  return result;
};

export const studentService = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  // updateStudentIntoDB,
  deleteStudentFromDB,
};
