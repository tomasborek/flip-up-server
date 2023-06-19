import { Request, Response } from "express";
import { prisma } from "@db/prisma";
import path from "path";
import fs, { WriteStream } from "fs";
import sharp from "sharp";
import { writeImage } from "src/common/services/writeImage";
import { deleteImage } from "src/common/services/deleteImage";

export const addAvatar = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: "No file provided" });
  if (!req.file.mimetype.startsWith("image"))
    return res.status(400).json({ message: "Invalid file type" });

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.userId) },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.id !== req.user!.id)
      return res.status(403).json({ message: "Forbidden" });
    if (user.avatar) {
      const fileName = user.avatar.split("/").pop();
      await deleteImage(path.join("uploads", "avatars", fileName!));
    }
    const fileName = `${Date.now()}_${user.id}_${req.file.originalname
      .split(".")[0]
      .replace("_", "-")
      .replace("/", "-")
      .slice(0, 20)}.jpg`;
    const writeStream = fs.createWriteStream(
      path.join("uploads", "avatars", fileName)
    );

    const resizedImage = sharp(req.file.buffer).resize({ width: 500 }).jpeg();
    const resizedImageBuffer = await resizedImage.toBuffer();
    await writeImage({ writeStream, buffer: resizedImageBuffer });
    await prisma.user.update({
      where: { id: user.id },
      data: {
        avatar: `${process.env.ROOT_URL}/uploads/avatars/${fileName}`,
      },
    });
    return res.status(200).json({ message: "Avatar added" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
