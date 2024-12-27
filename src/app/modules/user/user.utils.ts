import { SemesterModel } from '../academicSemester/academicSemester.model';
import { TFaculty } from '../faculty/faculty.interface';
import { TStudent } from '../student/student.interface';
import { UserModel } from './user.model';

//retrieving semester data
const semesterInfo = async (id: string) => {
  const result = await SemesterModel.findById(id);
  return result;
};

//generating student id
export const generateNewStudentId = async (studentData: TStudent) => {
  const semesterData = await semesterInfo(
    studentData.admissionSemester.toString(),
  );
  const idInitial = (0).toString();
  const firstStudentId = `${semesterData?.year}${semesterData?.code}${(idInitial + 1).padStart(4, '0')}`;

  const lastStudent = await UserModel.findOne({ role: 'student' }).sort({
    createdAt: -1,
  });

  const lastStudentSemesterYear = lastStudent?.id.slice(0, 4);
  const lastStudentSemesterCode = lastStudent?.id.slice(4, 6);

  //if the year and semester is new, then id will be new, or will maintain previous id serial
  if (
    lastStudentSemesterYear === semesterData?.year &&
    lastStudentSemesterCode === semesterData?.code
  ) {
    const LastStudentIdSlice = lastStudent?.id.slice(-4);
    const newStudentId = Number(LastStudentIdSlice) + 1;

    const assembleNewStudentId =
      lastStudentSemesterYear +
      lastStudentSemesterCode +
      newStudentId.toString().padStart(4, '0');

    return assembleNewStudentId;
  }
  return firstStudentId;
};

export const generateRoleBasedId = async (userData: TFaculty, role: string) => {
  const initialId = (0).toString();
  const facultyPrefix = 'F-';
  // const adminPrefix = 'A-';
  if (role === 'faculty') {
    const firstFacultyId = (initialId + 1).padStart(4, '0');

    const lastFaculty = await UserModel.find({ role: 'faculty' }).sort({
      createdAt: -1,
    });

    if (lastFaculty.length) {
      const lastFacultyIdNumeric = lastFaculty[0].id.substring(
        facultyPrefix.length,
      );
      const newFacultyId = (Number(lastFacultyIdNumeric) + 1)
        .toString()
        .padStart(4, '0');
      return `${facultyPrefix}${newFacultyId}`;
    } else {
      return `${facultyPrefix}${firstFacultyId}`;
    }
  }
  return 'Something went wrong while creating an ID';
};
