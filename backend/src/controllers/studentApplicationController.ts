import { Request, Response  } from "express";
import {
    getStudentApplicationService,
    createStudentApplicationService,
    editStudentApplicationService
} from "../services/studentApplicationService";
import { asyncHandler } from "../utils/asyncHandler";

export const getStudentApplications = asyncHandler(async (req: Request, res: Response) => {
    const studentApplicants = await getStudentApplicationService();
    res.status(200).json({
        status: "success",
        data: studentApplicants
    })
})

export const createStudentApplicant = asyncHandler(async (req: Request, res: Response) => {
    const newStudentApplicant = await createStudentApplicationService(req.body)
    res.status(200).json({
        status: "success",
        data: newStudentApplicant
    })
})

export const editStudentApplication = asyncHandler(async (req: Request, res: Response) => {
    const updatedStudentApplicant = await editStudentApplicationService(req.body, req.params.id)
    res.status(200).json({
        status: "success",
        data: updatedStudentApplicant
    })
})