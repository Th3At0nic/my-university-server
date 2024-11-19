"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentController = void 0;
const student_service_1 = require("./student.service");
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body.student);
        const { student } = req.body;
        const result = yield student_service_1.studentService.createStudentIntoDB(student);
        res.status(200).json({
            success: true,
            message: 'Student is created successfully!',
            data: result,
        });
    }
    catch (error) {
        console.log(error);
    }
});
const getAllStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield student_service_1.studentService.getAllStudentsFromDB();
        res.status(200).json({
            success: true,
            message: 'Students is retrieved successfully!',
            data: result,
        });
    }
    catch (error) {
        console.log(error);
    }
});
const getSingleStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield student_service_1.studentService.getSingleStudentFromDB(id);
    res.status(200).json({
        success: true,
        message: `The student with id ${id} is found successfully!`,
        data: result,
    });
});
exports.studentController = {
    createStudent,
    getAllStudents,
    getSingleStudent,
};
