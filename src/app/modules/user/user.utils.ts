import { SemesterModel } from '../academicSemester/academicSemester.model';
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
