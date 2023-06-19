import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { writeImage } from "src/common/services/writeImage";

export const addImages = async (req: Request, res: Response) => {
  const { listingId } = req.params;
  const images = req.files;

  if (!images || !images.length)
    return res.status(400).json({ error: "No images provided" });
  //@ts-ignore
  const nonImage = images.find((image) => !image.mimetype.startsWith("image"));
  if (nonImage) return res.status(400).json({ error: "Invalid file type" });

  try {
    const listing = await prisma.listing.findUnique({
      where: { id: Number(listingId) },
    });
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    if (req.user.id !== listing.userId)
      return res.status(403).json({ error: "Forbidden" });

    //@ts-ignore
    const imagePromises = images.map(async (file: Express.Multer.File) => {
      const fileName = `${Date.now().toString()}_${
        listing.id
      }_${file.originalname.slice(0, 10).slice(0, -4)}.jpg`;
      const writeStream = fs.createWriteStream(
        path.join("uploads", "listings", fileName)
      );

      const resizedImage = sharp(file.buffer).resize({ width: 500 }).jpeg();
      const resizedImageBuffer = await resizedImage.toBuffer();
      await writeImage({ writeStream, buffer: resizedImageBuffer });
      await prisma.listing.update({
        where: { id: Number(fileName.split("_")[1]) },
        data: {
          images: {
            create: {
              url: `${process.env.ROOT_URL}/uploads/listings/${fileName}`,
            },
          },
        },
      });
    });
    await Promise.all(imagePromises);
    return res.status(200).json(null);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
