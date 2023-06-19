import { Request, Response } from "express";
import { prisma } from "@db/prisma";
import path from "path";
import fs from "fs";
import sharp from "sharp";

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
      fs.unlink(path.join("uploads", "avatars", fileName!), (err) => {
        if (err)
          return res.status(500).json({ message: "Internal server error" });
      });
    }
    const fileName = `${Date.now()}_${user.id}_${req.file.originalname
      .split(".")[0]
      .slice(0, 10)}.jpg`;
    const writeStream = fs.createWriteStream(
      path.join("uploads", "avatars", fileName)
    );

    const resizedImage = sharp(req.file.buffer).resize({ width: 500 }).jpeg();
    const resizedImageBuffer = await resizedImage.toBuffer();
    writeStream.write(resizedImageBuffer);
    writeStream.on("error", (err) => {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    });
    writeStream.on("finish", async () => {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          avatar: `${process.env.ROOT_URL}/uploads/avatars/${fileName}`,
        },
      });
      return res.status(200).json({ message: "Avatar added" });
    });
    writeStream.end();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
