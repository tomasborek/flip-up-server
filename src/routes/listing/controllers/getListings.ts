import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
import { z } from "zod";
type QueryData = z.infer<typeof getListingsQuerySchema>;

export const getListings = async (req: Request, res: Response) => {
  const query = req.query as QueryData;

  try {
    const listings = await prisma.listing.findMany({
      where: {
        ...(query.category ? { categoryId: Number(query.category) } : null),
        ...(query.userId ? { userId: Number(query.userId) } : null),
        ...(query.likedBy
          ? { likedBy: { some: { id: Number(query.likedBy) } } }
          : null),
      },
      include: {
        user: query.include?.includes("user")
          ? {
              select: {
                id: true,
                username: true,
                avatar: true,
                lastActive: true,
                _count: {
                  select: { ratings: true },
                },
              },
            }
          : undefined,
        images: query.include?.includes("images") || undefined,
        category: query.include?.includes("category") || undefined,
        _count: {
          select: { likedBy: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    const listingsWithAdditionalData = await Promise.all(
      listings.map(async (listing) => {
        let likedBy = [];
        if (req.user) {
          likedBy = await prisma.listing.findMany({
            where: { id: listing.id, likedBy: { some: { id: req.user.id } } },
          });
        }
        return {
          ...listing,
          liked: likedBy.length > 0,
        };
      })
    );
    res.status(200).json({ listings: listingsWithAdditionalData });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getListingsQuerySchema = z.object({
  include: z.array(z.enum(["user", "images", "category"])).optional(),
  category: z.string().optional(),
  userId: z.string().optional(),
  likedBy: z.string().optional(),
});
