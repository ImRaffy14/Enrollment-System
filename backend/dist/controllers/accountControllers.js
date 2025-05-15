"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.changePassword = exports.editUser = exports.getUser = void 0;
const accountService_1 = require("../services/accountService");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await (0, accountService_1.getUserService)();
    res.status(200).json({
        status: "success",
        user: user,
    });
});
exports.editUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = req.body;
    const image = req.file;
    const id = req.params.id;
    const updatedUser = await (0, accountService_1.editUserService)(data, id, image);
    res.status(200).json({
        status: "success",
        message: "User updated successfully",
        user: updatedUser,
    });
});
exports.changePassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { password } = req.body;
    const id = req.params.id;
    const updatedUser = await (0, accountService_1.changePassowrdService)(password, id);
    res.status(200).json({
        status: "success",
        message: "Password updated successfully",
        user: updatedUser,
    });
});
exports.deleteUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const deletedUser = await (0, accountService_1.deleteUserService)(id);
    res.status(200).json({
        status: "success",
        message: "User deleted successfully",
        user: deletedUser,
    });
});
