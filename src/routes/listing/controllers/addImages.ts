import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export const addImages = async (req: Request, res: Response) => {
  const { listingId } = req.params;
  const images = req.files;

  if (!images || !images.length)
    return res.status(400).json({ error: "No images provided" });

  try {
    const listing = await prisma.listing.findUnique({
      where: { id: Number(listingId) },
    });
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    if (req.user.id !== listing.userId)
      return res.status(403).json({ error: "Forbidden" });

    //@ts-ignore
    const imagePromises = images.map((file: Express.Multer.File) => {
      const fileName = `${Date.now().toString()}_${
        listing.id
      }_${file.originalname.slice(0, 10).slice(0, -4)}.jpg`;
      return writeImage(file, fileName);
    });
    await Promise.all(imagePromises);
    return res.status(200).json(null);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const writeImage = async (file: Express.Multer.File, fileName: string) => {
  return new Promise(async (resolve, reject) => {
    const writeStream = fs.createWriteStream(
      path.join("uploads", "listings", fileName)
    );

    const resizedImage = sharp(file.buffer).resize({ width: 500 }).jpeg();
    const resizedImageBuffer = await resizedImage.toBuffer();

    writeStream.write(resizedImageBuffer);
    writeStream.on("error", (err) => {
      console.log(err);
      reject(err);
    });
    writeStream.on("finish", async () => {
      try {
        await prisma.listing.update({
          where: { id: Number(fileName.split("_")[1]) },
          data: {
            images: {
              create: {
                url: `http://localhost:3001/uploads/listings/${fileName}`,
              },
            },
          },
        });
        resolve(`http://localhost:3001/uploads/listings/${fileName}`);
      } catch (error) {
        reject(error);
      }
    });
    writeStream.end();
  });
};
