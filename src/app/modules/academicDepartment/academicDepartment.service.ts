import { TAcademicDepartment } from './academicDepartment.interface';
import { DepartmentModel } from './academicDepartment.model';

const createAcademicDepartmentIntoDB = async (data: TAcademicDepartment) => {
  const result = await DepartmentModel.create(data);
  return result;
};

const getAllAcademicDepartmentFromDB = async () => {
  const result = await DepartmentModel.find();
  return result;
};

const getAnAcademicDepartmentFromDB = async (id: string) => {
  const result = await DepartmentModel.findById(id);
  return result;
};

const updateAcademicDepartmentIntoDB = async (
  id: string,
  updateData: Partial<TAcademicDepartment>,
) => {
  const result = await DepartmentModel.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  return result;
};

export const AcademicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartmentFromDB,
  getAnAcademicDepartmentFromDB,
  updateAcademicDepartmentIntoDB,
};
