import type { Request, Response } from "express";
import { prisma } from "@db/prisma";

export const getListing = async (req: Request, res: Response) => {
  const { listingId } = req.params;
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: Number(listingId) },
      include: {
        user: true,
        images: true,
        category: true,
      },
    });
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.status(200).json({ listing });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
