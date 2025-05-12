import prisma from "../config/prisma";
import { AppError } from "../utils/appError";
import { User, EditUser} from "../types";
import { Image, UserRole } from '@prisma/client';
import { uploadImage, deleteImage } from './imageUploadService';
import bcrypt from 'bcryptjs';

export const getUserService = async () => {
    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    return users;
}

export const editUserService = async (
  data: EditUser,
  id: string,
  image: Express.Multer.File | undefined
) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const updatedFields: any = {
    name: data.name,
    email: data.email,
    role: data.role as UserRole,
  };

  let newImageData: { imageUrl: string; publicId: string } | undefined;

  if (data.imagePublicId && image?.buffer) {
    const deleted = deleteImage(data.imagePublicId);
    if (!deleted) {
      throw new AppError('Image delete failed', 500);
    }

    const uploadResult = await uploadImage(image.buffer, 'users-avatar');
    if (!uploadResult) {
      throw new AppError('Image upload failed', 500);
    }

    newImageData = {
      imageUrl: uploadResult.url,
      publicId: uploadResult.public_id,
    };
  }

  const updateData: any = {
    ...updatedFields,
    ...(newImageData && { image: newImageData }),
  };

  const userUpdated = await prisma.user.update({
    where: { id },
    data: updateData,
  });

  return userUpdated;
};

export const changePassowrdService = async (data: string, id: string) => {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    const isPasswordCorrect = await bcrypt.compare(data, user.password);
    if (isPasswordCorrect) {
        throw new AppError('New password cannot be the same as the old password', 400);
    }
    
    const hashedPassword = await bcrypt.hash(data, 10);

    const userUpdated = await prisma.user.update({
        where: { id },
        data: { password: hashedPassword },
    });

    return userUpdated;
}

export const deleteUserService = async (id: string) => {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    if (user.image) {
        const deleted = deleteImage(user.image.publicId);
        if (!deleted) {
            throw new AppError('Image delete failed', 500);
        }
    }

    const deletedUser = await prisma.user.delete({ where: { id } });

    return deletedUser;
}