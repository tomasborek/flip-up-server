import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
import { z } from "zod";

type Data = z.infer<typeof getCategoriesQuerySchema>;

export const getCategories = async (req: Request, res: Response) => {
  const query = req.query as Data;

  let include = new Map();

  if (Number(query.levels) === 1) {
    include.set("subCategories", true);
  } else if (Number(query.levels) === 2) {
    include.set("subCategories", { select: { subCategories: true } });
  }

  if (query.parentCategoryIds) {
    include.set("parentCategories", { select: { id: true } });
  }

  try {
    const categories = await prisma.category.findMany({
      where: {
        core: query.core ? true : undefined,
      },
      include:
        Object.keys(Object.fromEntries(include)).length > 0
          ? Object.fromEntries(include)
          : {},
      orderBy: { title: "asc" },
    });
    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCategoriesQuerySchema = z.object({
  levels: z.enum(["1", "2"]).optional(),
  core: z.enum(["true"]).optional(),
  parentCategoryIds: z.enum(["true"]).optional(),
  exportFormat: z.enum(["true"]).optional(),
});
