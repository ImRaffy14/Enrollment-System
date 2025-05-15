import { Request, Response } from "express";
import {
  getStudentsService,
  getStudentByIdService,
  updateStudentService,
  updateStudentStatusService
} from "../services/studentService";
import { asyncHandler } from "../utils/asyncHandler";

export const getStudents = asyncHandler(async (req: Request, res: Response) => {
  const students = await getStudentsService();
  res.status(200).json({
    status: "success",
    data: students
  });
});

export const getStudent = asyncHandler(async (req: Request, res: Response) => {
  const student = await getStudentByIdService(req.params.id);
  res.status(200).json({
    status: "success",
    data: student
  });
});

export const updateStudent = asyncHandler(async (req: Request, res: Response) => {
  const updatedStudent = await updateStudentService(req.body, req.params.id);
  res.status(200).json({
    status: "success",
    data: updatedStudent
  });
});

export const updateStudentStatus = asyncHandler(async (req: Request, res: Response) => {
  const updatedStudent = await updateStudentStatusService(req.body.status, req.params.id);
  res.status(200).json({
    status: "success",
    data: updatedStudent
  });
});