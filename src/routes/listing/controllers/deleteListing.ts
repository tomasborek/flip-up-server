import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
import path from "path";
import { deleteImage } from "src/common/services/deleteImage";

export const deleteListing = async (req: Request, res: Response) => {
  const { listingId } = req.params;

  try {
    const listing = await prisma.listing.findUnique({
      where: { id: Number(listingId) },
      include: { images: true },
    });
    if (!listing) return res.status(404).send({ message: "Listing not found" });
    if (req.user!.id !== listing.userId)
      return res.status(403).send({ message: "Forbidden" });

    if (listing.images) {
      listing.images.forEach((image) => {
        deleteImage(
          path.join(
            "uploads",
            "listings",
            image.url.split("/")[image.url.split("/").length - 1]
          )
        );
      });
    }
    await prisma.listing.delete({
      where: { id: Number(listingId) },
    });

    return res.status(200).send(null);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
