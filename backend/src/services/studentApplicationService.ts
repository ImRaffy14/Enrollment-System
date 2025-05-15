import prisma from "../config/prisma";
import { AppError } from '../utils/appError';

export const getStudentApplicationService = async () => {
    const result = await prisma.studentApplicant.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })

    return result
}

export const createStudentApplicationService = async (data: any) => {

    const address = `${data.address} ${data.city} ${data.state} ${data.zip}`

    const result = await prisma.studentApplicant.create({
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
    })

    return result
}

export const editStudentApplicationService = async (data: any, id: string) => {

    if(data.status === "APPROVED") {
        await prisma.studentAdmission.create({
            data:{
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
        })
    }

    const result = await prisma.studentApplicant.update({
        where: {id},
        data:{
            appId: data.appId,
            program: data.program,
            gender: data.gender,
            status: data.status,
            documents: data.documents,
            email: data.email,
            firstName: data.firstName,
        }
    })

    return result
}