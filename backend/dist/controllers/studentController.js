"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStudentStatus = exports.updateStudent = exports.getStudent = exports.getStudents = void 0;
const studentService_1 = require("../services/studentService");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getStudents = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const students = await (0, studentService_1.getStudentsService)();
    res.status(200).json({
        status: "success",
        data: students
    });
});
exports.getStudent = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const student = await (0, studentService_1.getStudentByIdService)(req.params.id);
    res.status(200).json({
        status: "success",
        data: student
    });
});
exports.updateStudent = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const updatedStudent = await (0, studentService_1.updateStudentService)(req.body, req.params.id);
    res.status(200).json({
        status: "success",
        data: updatedStudent
    });
});
exports.updateStudentStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const updatedStudent = await (0, studentService_1.updateStudentStatusService)(req.body.status, req.params.id);
    res.status(200).json({
        status: "success",
        data: updatedStudent
    });
});
