import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
import { z } from "zod";

type Data = z.infer<typeof getCategoriesQuerySchema>;

export const getCategories = async (req: Request, res: Response) => {
  const query = req.query as Data;
  try {
    const categories = await prisma.category.findMany({
      where: {
        core: true,
      },
      include: {
        subCategories: {
          include: {
            subCategories: {
              include: {
                subCategories: true,
              },
            },
          },
        },
      },
    });
    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCategoriesQuerySchema = z.object({
  parentCategoryId: z.number().optional(),
  parentCategoryName: z.string().optional(),
});