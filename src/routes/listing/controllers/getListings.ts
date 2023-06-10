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
      },
      ...(query.include
        ? {
            include: {
              user: query.include.includes("user"),
              images: query.include.includes("images"),
              category: query.include.includes("category"),
            },
          }
        : null),
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ listings });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getListingsQuerySchema = z.object({
  include: z.array(z.enum(["user", "images", "category"])).optional(),
  category: z.string().optional(),
  userId: z.string().optional(),
});
