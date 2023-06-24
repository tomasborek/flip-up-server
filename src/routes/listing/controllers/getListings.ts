import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
import { z } from "zod";
import { isLiked } from "src/common/services/listing/isLiked";
type QueryData = z.infer<typeof getListingsQuerySchema>;

export const getListings = async (req: Request, res: Response) => {
  const query = req.query as QueryData;

  if (query.userId && query.byFollowed)
    return res.status(400).json({ message: "Invalid query" });

  if (query.byFollowed && !req.user) {
    return res.status(200).json({ listings: [] });
  }

  try {
    if (query.category) {
      const category = await prisma.category.findUnique({
        where: { id: Number(query.category) },
      });
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    const listings = await prisma.listing.findMany({
      take: query.limit ? Number(query.limit) : 20,
      orderBy: { createdAt: "desc" },
      where: {
        userId: query.byFollowed
          ? {
              in: (
                await prisma.user.findUnique({
                  where: { id: req.user!.id },
                  select: { following: true },
                })
              )?.following.map((f) => f.id),
            }
          : query.userId
          ? Number(query.userId)
          : undefined,
        likedBy: query.likedBy
          ? { some: { id: Number(query.likedBy) } }
          : undefined,
        category: query.category
          ? {
              OR: [
                { id: Number(query.category) },
                { parentCategories: { some: { id: Number(query.category) } } },
              ],
            }
          : undefined,
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
    });
    const listingsWithAdditionalData = await Promise.all(
      listings.map(async (listing) => {
        return {
          ...listing,
          liked: await isLiked(req.user?.id, listing.id),
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
  limit: z.string().optional(),
  byFollowed: z.string().optional(),
});
