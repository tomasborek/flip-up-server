import { Request, Response } from "express";
import { prisma } from "@db/prisma";
import path from "path";
import fs from "fs";
import sharp from "sharp";

export const addMessageImage = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: "No file provided" });
  if (!req.file.mimetype.startsWith("image"))
    return res.status(400).json({ message: "Invalid file type" });
  try {
    const message = await prisma.message.findUnique({
      where: { id: Number(req.params.messageId) },
    });
    if (!message) return res.status(404).json({ message: "User not found" });
    if (message.userId !== req.user!.id)
      return res.status(403).json({ message: "Forbidden" });
    if (message.image) {
      return res.status(400).json({ message: "Message already has an image" });
    }
    const fileName = `${Date.now()}_${message.id}_${req.file.originalname
      .split(".")[0]
      .slice(0, 10)}.jpg`;
    const writeStream = fs.createWriteStream(
      path.join("uploads", "messages", fileName)
    );

    const resizedImage = sharp(req.file.buffer).resize({ width: 500 }).jpeg();
    const resizedImageBuffer = await resizedImage.toBuffer();
    writeStream.write(resizedImageBuffer);
    writeStream.on("error", (err) => {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    });
    writeStream.on("finish", async () => {
      await prisma.message.update({
        where: { id: Number(req.params.messageId) },
        data: {
          image: `${process.env.ROOT_URL}/uploads/messages/${fileName}`,
        },
      });
      return res.status(200).json(null);
    });
    writeStream.end();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
