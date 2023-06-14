import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
import { z } from "zod";
type QueryData = z.infer<typeof getListingsQuerySchema>;

export const getListings = async (req: Request, res: Response) => {
  const query = req.query as QueryData;

  if (query.byFollowed && !req.user) {
    return res.status(401).json({ message: "Unauthorized" });
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
      where: {
        ...(query.byFollowed
          ? {
              userId: {
                in: (
                  await prisma.user.findUnique({
                    where: { id: req.user?.id },
                    select: { following: true },
                  })
                )?.following.map((f) => f.id),
              },
            }
          : {}),
        ...(query.category
          ? {
              category: {
                OR: [
                  {
                    id: Number(query.category),
                  },
                  {
                    parentCategories: { some: { id: Number(query.category) } },
                  },
                  {
                    parentCategories: {
                      some: {
                        parentCategories: {
                          some: { id: Number(query.category) },
                        },
                      },
                    },
                  },
                  {
                    parentCategories: {
                      some: {
                        parentCategories: {
                          some: {
                            parentCategories: {
                              some: { id: Number(query.category) },
                            },
                          },
                        },
                      },
                    },
                  },
                ],
              },
            }
          : null),
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
        return {
          ...listing,
          liked:
            (
              await prisma.listing.findMany({
                where: {
                  id: listing.id,
                  likedBy: { some: { id: req.user.id } },
                },
              })
            ).length > 0,
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
