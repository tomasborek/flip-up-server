import type { Request, Response } from "express";

import { prisma } from "@db/prisma";
import { z } from "zod";

type Data = z.infer<typeof categorySchema>;

export const createCategory = async (req: Request, res: Response) => {
  const body = req.body as Data;

  try {
    await prisma.category.create({
      data: {
        title: body.title,
        applicable: body.applicable,
        icon: body.icon,
        core: body.core,
        parentCategories: body.parentCategoryId
          ? { connect: { id: body.parentCategoryId } }
          : undefined,
      },
    });
    res.status(201).json(null);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const categorySchema = z.object({
  title: z.string().min(1).max(255).trim(),
  applicable: z.boolean(),
  icon: z.string().min(1).max(255).optional(),
  core: z.boolean(),
  parentCategoryId: z.number().int().optional(),
});
