import { Request, Response } from "express";
import {
    getUserService,
    editUserService,
    changePassowrdService,
    deleteUserService,
} from "../services/accountService";
import { asyncHandler } from "../utils/asyncHandler";

export const getUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await getUserService();
    res.status(200).json({
        status: "success",
        user: user,
    });
})

export const editUser = asyncHandler( async (req: Request, res: Response) => {
    const data = req.body
    const image = req.file
    const id = req.params.id

    const updatedUser = await editUserService(data, id, image)

    res.status(200).json({
        status: "success",
        message: "User updated successfully",
        user: updatedUser,
    })
})

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
    const { password } = req.body
    const id = req.params.id

    const updatedUser = await changePassowrdService(password, id)

    res.status(200).json({
        status: "success",
        message: "Password updated successfully",
        user: updatedUser,
    })
})

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id

    const deletedUser = await deleteUserService(id)

    res.status(200).json({
        status: "success",
        message: "User deleted successfully",
        user: deletedUser,
    })
})