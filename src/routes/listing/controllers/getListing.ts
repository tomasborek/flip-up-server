import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
import { isLiked } from "src/common/services/listing/isLiked";

export const getListing = async (req: Request, res: Response) => {
  const { listingId } = req.params;
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: Number(listingId) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            lastActive: true,
            _count: {
              select: { ratings: true },
            },
          },
        },
        images: true,
        category: true,
        _count: {
          select: { likedBy: true },
        },
      },
    });
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    const liked = isLiked(req.user?.id, listing.id);

    const listingWithAdditionalData = {
      ...listing,
      liked,
      owned: listing.user.id === Number(req.user?.id),
    };
    res.status(200).json({ listing: listingWithAdditionalData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
