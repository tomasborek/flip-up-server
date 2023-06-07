import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
import { z } from "zod";

type Data = z.infer<typeof getCategoriesQuerySchema>;

export const getCategories = async (req: Request, res: Response) => {
  const query = req.query as Data;

  let include = {};

  if (Number(query.levels) === 1) {
    include = {
      subCategories: true,
    };
  } else if (Number(query.levels) === 2) {
    include = {
      subCategories: {
        include: {
          subCategories: true,
        },
      },
    };
  } else if (Number(query.levels) === 3) {
    include = {
      subCategories: {
        include: {
          subCategories: {
            include: {
              subCategories: true,
            },
          },
        },
      },
    };
  }

  if (query.parentCategoryIds) {
    include = {
      ...include,
      parentCategories: {
        select: {
          id: true,
        },
      },
    };
  }

  try {
    const categories = await prisma.category.findMany({
      where: {
        core: query.core ? true : undefined,
      },
      ...(include ? { include } : {}),
    });
    return res.status(200).json({ categories });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCategoriesQuerySchema = z.object({
  levels: z.string().optional(),
  core: z.enum(["true"]).optional(),
  parentCategoryIds: z.enum(["true"]).optional(),
  exportFormat: z.enum(["true"]).optional(),
});
