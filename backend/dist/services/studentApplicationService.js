"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editStudentApplicationService = exports.createStudentApplicationService = exports.getStudentApplicationService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getStudentApplicationService = async () => {
    const result = await prisma_1.default.studentApplicant.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
    return result;
};
exports.getStudentApplicationService = getStudentApplicationService;
const createStudentApplicationService = async (data) => {
    const address = `${data.address} ${data.city} ${data.state} ${data.zip}`;
    const result = await prisma_1.default.studentApplicant.create({
        data: {
            appId: data.appId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            address: address,
            birthDate: data.birthDate,
            gender: data.gender,
            status: data.status,
            educationLevel: data.educationLevel,
            program: data.program,
            documents: data.documents
        }
    });
    return result;
};
exports.createStudentApplicationService = createStudentApplicationService;
const editStudentApplicationService = async (data, id) => {
    if (data.status === "APPROVED") {
        await prisma_1.default.studentAdmission.create({
            data: {
                appId: data.appId,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                birthdate: data.birthDate,
                gender: data.gender,
                status: "Pending",
                documents: data.documents,
                program: data.program,
            }
        });
    }
    const result = await prisma_1.default.studentApplicant.update({
        where: { id },
        data: {
            appId: data.appId,
            program: data.program,
            gender: data.gender,
            status: data.status,
            documents: data.documents,
            email: data.email,
            firstName: data.firstName,
        }
    });
    return result;
};
exports.editStudentApplicationService = editStudentApplicationService;
