"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editStudentApplication = exports.createStudentApplicant = exports.getStudentApplications = void 0;
const studentApplicationService_1 = require("../services/studentApplicationService");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getStudentApplications = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const studentApplicants = await (0, studentApplicationService_1.getStudentApplicationService)();
    res.status(200).json({
        status: "success",
        data: studentApplicants
    });
});
exports.createStudentApplicant = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const newStudentApplicant = await (0, studentApplicationService_1.createStudentApplicationService)(req.body);
    res.status(200).json({
        status: "success",
        data: newStudentApplicant
    });
});
exports.editStudentApplication = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const updatedStudentApplicant = await (0, studentApplicationService_1.editStudentApplicationService)(req.body, req.params.id);
    res.status(200).json({
        status: "success",
        data: updatedStudentApplicant
    });
});
