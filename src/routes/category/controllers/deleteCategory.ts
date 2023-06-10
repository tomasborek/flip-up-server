import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await prisma.category.delete({
      where: { id: Number(req.params.categoryId) },
    });
    res.status(200).json(null);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
