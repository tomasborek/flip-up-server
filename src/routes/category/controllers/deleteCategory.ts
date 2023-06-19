import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(req.params.categoryId) },
      include: { subCategories: true },
    });
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    await prisma.category.delete({
      where: { id: Number(req.params.categoryId) },
    });
    if (category.subCategories.length > 0) {
      await Promise.all(
        category.subCategories.map((subCategory) => {
          return prisma.category.delete({ where: { id: subCategory.id } });
        })
      );
    }
    res.status(200).json(null);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
