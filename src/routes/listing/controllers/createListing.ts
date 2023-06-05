import { prisma } from "@db/prisma";
import type { Request, Response } from "express";
import { z } from "zod";

type Data = z.infer<typeof listingSchema>;

export const createListing = async (req: Request, res: Response) => {
  const body: Data = req.body;
  try {
    if (body.userId !== req.user!.id)
      return res.status(403).json({ message: "Forbidden" });
    const user = await prisma.user.findUnique({
      where: { id: body.userId },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    const category = await prisma.category.findUnique({
      where: { id: body.categoryId },
    });
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    const listing = await prisma.listing.create({
      data: {
        title: body.title,
        description: body.description,
        location: body.location,
        user: { connect: { id: body.userId } },
        category: { connect: { id: body.categoryId } },
      },
    });
    res.status(201).json({ listing });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const listingSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().max(1000).optional(),
  location: z.string().trim().max(255).min(1),
  userId: z.number(),
  categoryId: z.number(),
});
