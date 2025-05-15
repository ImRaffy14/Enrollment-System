import prisma from "../config/prisma";

export const getStudentAdmissionsService = async () => {
    const result = await prisma.studentAdmission.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })

    return result
}

export const getStudentAdmissionByIdService = async (id: string) => {
    const result = await prisma.studentAdmission.findUnique({
        where: { id }
    })

    return result
}

export const createStudentAdmissionService = async (data: any) => {
    const result = await prisma.studentAdmission.create({
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
    })

    return result
}

export const updateStudentAdmissionService = async (data: any, id: string) => {

  console.log("Incoming data:", data)
  if (data.status === "APPROVED") {
    const studentName = `${data.firstName} ${data.lastName}`;

    // Count existing students to generate next student ID
    const count = await prisma.student.count();
    const paddedCount = String(count + 1).padStart(3, "0"); // STUD-001, STUD-002
    const studentId = `STUD-${paddedCount}`;

    // Create student record
    await prisma.student.create({
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
  const result = await prisma.studentAdmission.update({
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


export const deleteStudentAdmissionService = async (id: string) => {
    const result = await prisma.studentAdmission.delete({
        where: { id }
    })

    return result
}