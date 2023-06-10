import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
import { z } from "zod";

type Data = z.infer<typeof createCategoriesSchema>;

export const createCategories = async (req: Request, res: Response) => {
  const body = req.body as Data;
  try {
    const promises = body.categories.map((category) => {
      return prisma.category.create({
        data: {
          title: category.title,
          applicable: category.applicable,
          icon: category.icon,
          core: category.core,
          parentCategories: {
            connect: category.parentCategoryIds?.map((id) => ({ id })) ?? [],
          },
        },
      });
    });
    await Promise.all(promises);
    res.status(201).json(null);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const createCategoriesSchema = z.object({
  categories: z.array(
    z.object({
      title: z.string().min(1).max(255),
      applicable: z.boolean().optional(),
      icon: z.string().min(1).max(255).optional(),
      core: z.boolean().optional(),
      parentCategoryIds: z.array(z.number().int()).optional(),
    })
  ),
});

