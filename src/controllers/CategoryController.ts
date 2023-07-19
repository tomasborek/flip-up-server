import { type Request, type Response } from "express";
import { response } from "@utils/response";
import CategoryRepository from "@repositories/CategoryRepository";

const CategoryController = {
  create: async (req: Request, res: Response) => {
    await CategoryRepository.create(req.body);
    response({
      res,
      status: 201,
      message: "Successfully created category",
    });
  },
  delete: async (req: Request, res: Response) => {
    const category = await CategoryRepository.findById(
      Number(req.params.categoryId),
      { include: { subcategories: true } }
    );
    if (!category)
      return response({ res, status: 404, message: "Category not found" });
    await CategoryRepository.delete(Number(req.params.categoryId));
    if (category.subCategories.length > 0) {
      await Promise.all(
        category.subCategories.map((subCategory) => {
          return CategoryRepository.delete(subCategory.id);
        })
      );
    }
    response({
      res,
      status: 200,
      message: "Successfully deleted category",
    });
  },
  getMany: async (req: Request, res: Response) => {
    const categories = await CategoryRepository.findMany(req.query);
    response({
      res,
      status: 200,
      message: "Successfully retrieved categories",
      data: {
        categories,
      },
    });
  },
};

export default CategoryController;
