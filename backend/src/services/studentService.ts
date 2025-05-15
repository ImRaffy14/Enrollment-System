import prisma from "../config/prisma";
import { AppError } from '../utils/appError';

export const getStudentsService = async () => {
  return await prisma.student.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const getStudentByIdService = async (id: string) => {
  const student = await prisma.student.findUnique({
    where: { id }
  });

  if (!student) {
    throw new AppError('Student not found', 404);
  }

  return student;
};

export const updateStudentService = async (data: any, id: string) => {
  return await prisma.student.update({
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

export const updateStudentStatusService = async (status: string, id: string) => {
  return await prisma.student.update({
    where: { id },
    data: { 
      status,
      // Clear subjects if status is DROPPED
      subjects: status === "DROPPED" ? [] : undefined
    }
  });
};