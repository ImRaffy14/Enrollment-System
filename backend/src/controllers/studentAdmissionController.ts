import { Request, Response } from "express";
import {
    getStudentAdmissionsService,
    getStudentAdmissionByIdService,
    createStudentAdmissionService,
    updateStudentAdmissionService,
    deleteStudentAdmissionService
} from "../services/studentAdmissionService";
import { asyncHandler } from "../utils/asyncHandler";

export const getStudentAdmissions = asyncHandler(async (req: Request, res: Response) => {
    const admissions = await getStudentAdmissionsService();
    res.status(200).json({
        status: "success",
        data: admissions
    })
})

export const getStudentAdmission = asyncHandler(async (req: Request, res: Response) => {
    const admission = await getStudentAdmissionByIdService(req.params.id);
    res.status(200).json({
        status: "success",
        data: admission
    })
})

export const createStudentAdmission = asyncHandler(async (req: Request, res: Response) => {
    const newAdmission = await createStudentAdmissionService(req.body)
    res.status(201).json({
        status: "success",
        data: newAdmission
    })
})

export const updateStudentAdmission = asyncHandler(async (req: Request, res: Response) => {
    const updatedAdmission = await updateStudentAdmissionService(req.body, req.params.id)
    res.status(200).json({
        status: "success",
        data: updatedAdmission
    })
})

export const deleteStudentAdmission = asyncHandler(async (req: Request, res: Response) => {
    await deleteStudentAdmissionService(req.params.id)
    res.status(204).json({
        status: "success",
        data: null
    })
})