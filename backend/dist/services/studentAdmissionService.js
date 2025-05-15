"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudentAdmissionService = exports.updateStudentAdmissionService = exports.createStudentAdmissionService = exports.getStudentAdmissionByIdService = exports.getStudentAdmissionsService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getStudentAdmissionsService = async () => {
    const result = await prisma_1.default.studentAdmission.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
    return result;
};
exports.getStudentAdmissionsService = getStudentAdmissionsService;
const getStudentAdmissionByIdService = async (id) => {
    const result = await prisma_1.default.studentAdmission.findUnique({
        where: { id }
    });
    return result;
};
exports.getStudentAdmissionByIdService = getStudentAdmissionByIdService;
const createStudentAdmissionService = async (data) => {
    const result = await prisma_1.default.studentAdmission.create({
        data: {
            appId: data.appId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            birthdate: data.birthdate,
            gender: data.gender,
            status: data.status,
            documents: data.documents,
            program: data.program // Added required 'program' property
        }
    });
    return result;
};
exports.createStudentAdmissionService = createStudentAdmissionService;
const updateStudentAdmissionService = async (data, id) => {
    console.log("Incoming data:", data);
    if (data.status === "APPROVED") {
        const studentName = `${data.firstName} ${data.lastName}`;
        // Count existing students to generate next student ID
        const count = await prisma_1.default.student.count();
        const paddedCount = String(count + 1).padStart(3, "0"); // STUD-001, STUD-002
        const studentId = `STUD-${paddedCount}`;
        // Create student record
        await prisma_1.default.student.create({
            data: {
                studentId,
                studentName,
                email: data.email,
                program: data.program,
                status: "PENDING",
                documents: data.documents,
                academicYear: "2025-2026",
                semester: "First",
                subjects: [], // Empty array or pre-defined if necessary
            },
        });
    }
    // Update the student admission record
    const result = await prisma_1.default.studentAdmission.update({
        where: { id },
        data: {
            appId: data.appId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            birthdate: data.birthdate, // Ensure Date is properly formatted
            gender: data.gender,
            status: data.status,
            documents: data.documents,
        },
    });
    return result;
};
exports.updateStudentAdmissionService = updateStudentAdmissionService;
const deleteStudentAdmissionService = async (id) => {
    const result = await prisma_1.default.studentAdmission.delete({
        where: { id }
    });
    return result;
};
exports.deleteStudentAdmissionService = deleteStudentAdmissionService;
