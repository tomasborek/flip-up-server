import type { Request, Response } from "express";
import { prisma } from "@db/prisma";

export const likeListing = async (req: Request, res: Response) => {
  const { listingId } = req.params;
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: Number(listingId) },
      include: { likedBy: true },
    });
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (listing.likedBy.map((u) => u.id).includes(req.user!.id))
      return res.status(400).json({ message: "Listing already liked" });
    await prisma.listing.update({
      where: { id: Number(listingId) },
      data: { likedBy: { connect: { id: req.user!.id } } },
    });
    res.status(201).json(null);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
