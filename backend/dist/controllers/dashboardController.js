"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUpcomingEvents = exports.getRecentApplications = exports.getDashboardStats = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getDashboardStats = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // Get counts from database
    const [totalApplications, approvedAdmissions, enrolledStudents] = await Promise.all([
        prisma_1.default.studentApplicant.count(),
        prisma_1.default.studentApplicant.count({ where: { status: "APPROVED" } }),
        prisma_1.default.student.count(),
    ]);
    // Calculate changes (you might want to store historical data for accurate changes)
    const stats = {
        totalApplications: {
            value: totalApplications,
            change: "+12.5%" // This would come from your analytics
        },
        approvedAdmissions: {
            value: approvedAdmissions,
            change: "+8.3%"
        },
        enrolledStudents: {
            value: enrolledStudents,
            change: "+5.2%"
        },
        supplyAgreements: {
            value: 0,
            change: "+7.1%"
        }
    };
    res.status(200).json({
        status: "success",
        data: stats
    });
});
exports.getRecentApplications = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const applications = await prisma_1.default.studentApplicant.findMany({
        take: 5,
        orderBy: {
            createdAt: "desc"
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            program: true,
            status: true,
            createdAt: true,
        }
    });
    res.status(200).json({
        status: "success",
        data: applications.map(app => ({
            ...app,
            studentName: `${app.firstName} ${app.lastName}`
        }))
    });
});
exports.getUpcomingEvents = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // This would come from your events/calendar system
    const events = [
        {
            title: "Interview with Sarah Williams",
            date: new Date("2025-05-15T13:30:00Z"),
            type: "interview"
        },
        {
            title: "New Student Orientation",
            date: new Date("2025-05-20T09:00:00Z"),
            type: "orientation"
        },
        {
            title: "Payment Deadline for Engineering Students",
            date: new Date("2025-05-25T23:59:59Z"),
            type: "payment"
        },
        {
            title: "Fall Semester Enrollment Begins",
            date: new Date("2025-06-01T08:00:00Z"),
            type: "enrollment"
        }
    ];
    res.status(200).json({
        status: "success",
        data: events
    });
});
