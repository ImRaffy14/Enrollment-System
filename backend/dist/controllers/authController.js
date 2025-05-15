"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const authService_1 = require("../services/authService");
const asyncHandler_1 = require("../utils/asyncHandler");
const prisma_1 = __importDefault(require("../config/prisma"));
exports.registerUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userRegistered = await (0, authService_1.registerService)(req.body, req.file);
    res.status(201).json({
        status: 'success',
        message: `User ${userRegistered.name} registered successfully`,
        user: userRegistered,
    });
});
exports.loginUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userLoggedIn = await (0, authService_1.loginService)(req.body);
    res.cookie('accessToken', userLoggedIn.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
    })
        .status(200)
        .json({
        status: 'success',
        message: 'Logged in successfully',
    });
});
exports.getUserProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.userId;
    const userData = await prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    res.status(200).json({
        status: 'success',
        user: userData,
    });
});
exports.logoutUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    res.clearCookie('accessToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
        .status(200)
        .json({
        status: 'success',
        message: 'Logged out successfully',
    });
});
