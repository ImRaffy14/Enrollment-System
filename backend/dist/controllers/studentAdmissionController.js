"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudentAdmission = exports.updateStudentAdmission = exports.createStudentAdmission = exports.getStudentAdmission = exports.getStudentAdmissions = void 0;
const studentAdmissionService_1 = require("../services/studentAdmissionService");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getStudentAdmissions = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const admissions = await (0, studentAdmissionService_1.getStudentAdmissionsService)();
    res.status(200).json({
        status: "success",
        data: admissions
    });
});
exports.getStudentAdmission = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const admission = await (0, studentAdmissionService_1.getStudentAdmissionByIdService)(req.params.id);
    res.status(200).json({
        status: "success",
        data: admission
    });
});
exports.createStudentAdmission = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const newAdmission = await (0, studentAdmissionService_1.createStudentAdmissionService)(req.body);
    res.status(201).json({
        status: "success",
        data: newAdmission
    });
});
exports.updateStudentAdmission = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const updatedAdmission = await (0, studentAdmissionService_1.updateStudentAdmissionService)(req.body, req.params.id);
    res.status(200).json({
        status: "success",
        data: updatedAdmission
    });
});
exports.deleteStudentAdmission = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await (0, studentAdmissionService_1.deleteStudentAdmissionService)(req.params.id);
    res.status(204).json({
        status: "success",
        data: null
    });
});
