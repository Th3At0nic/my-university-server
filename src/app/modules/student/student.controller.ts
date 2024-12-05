import { Request, Response } from 'express';
import { studentService } from './student.service';
import studentValidationSchema from './student.validation';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;

    const zodParsedData = studentValidationSchema.parse(studentData);

    const result = await studentService.createStudentIntoDB(zodParsedData);
    res.status(200).json({
      success: true,
      message: 'Student is created successfully!',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: (err as Error).message || 'Something went wrong!',
      error: err,
    });
    console.log(err);
  }
};

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await studentService.getAllStudentsFromDB();
    res.status(200).json({
      success: true,
      message: 'Students is retrieved successfully!',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: (err as Error).message || 'Something went wrong!',
      error: err,
    });
    console.log(err);
  }
};

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await studentService.getSingleStudentFromDB(id);
    res.status(200).json({
      success: true,
      message: `The student with id ${id} is found!`,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: (err as Error).message || 'Something went wrong!',
      error: err,
    });
    console.log(err);
  }
};

// this update section does not work as expected, need to fix the issue, will do later
// const updateStudent = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;
//     const validatedData = studentValidationSchema.parse(updateData);
//     const result = studentService.updateStudentIntoDB(id, validatedData);
//     res.status(200).json({
//       success: true,
//       message: `Student data with id: ${id} is updated successfully`,
//       data: result,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: (err as Error).message || 'Something went wrong!',
//       error: err,
//     });
//   }
// };

const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await studentService.deleteStudentFromDB(id);
    res.status(200).json({
      success: true,
      message: '204 No Content, Deleted Successfully.',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: (err as Error).message || 'Something went wrong!',
      error: err,
    });
  }
};

export const studentController = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  // updateStudent,
  deleteStudent,
};
