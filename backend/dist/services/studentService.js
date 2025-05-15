"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStudentStatusService = exports.updateStudentService = exports.getStudentByIdService = exports.getStudentsService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const appError_1 = require("../utils/appError");
const getStudentsService = async () => {
    return await prisma_1.default.student.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
};
exports.getStudentsService = getStudentsService;
const getStudentByIdService = async (id) => {
    const student = await prisma_1.default.student.findUnique({
        where: { id }
    });
    if (!student) {
        throw new appError_1.AppError('Student not found', 404);
    }
    return student;
};
exports.getStudentByIdService = getStudentByIdService;
const updateStudentService = async (data, id) => {
    return await prisma_1.default.student.update({
        where: { id },
        data: {
            studentName: data.studentName,
            email: data.email,
            program: data.program,
            status: data.status,
            academicYear: data.academicYear,
            semester: data.semester,
            subjects: data.subjects
        }
    });
};
exports.updateStudentService = updateStudentService;
const updateStudentStatusService = async (status, id) => {
    return await prisma_1.default.student.update({
        where: { id },
        data: {
            status,
            // Clear subjects if status is DROPPED
            subjects: status === "DROPPED" ? [] : undefined
        }
    });
};
exports.updateStudentStatusService = updateStudentStatusService;
