import CategoryController from "@controllers/CategoryController";
import { adminProtectedRoute } from "@middlewares/adminProtectedRoute";
import { controller } from "@middlewares/controller";
import validate from "@middlewares/validate";
import validateQuery from "@middlewares/validateQuery";
import CategoryValidator from "@validators/CategoryValidator";
import { Router } from "express";
const CategoryRoute = Router();
CategoryRoute.get(
  "/",
  validateQuery(CategoryValidator.getMany),
  controller(CategoryController.getMany)
);

CategoryRoute.use(adminProtectedRoute);

CategoryRoute.post(
  "/",
  validate(CategoryValidator.create),
  controller(CategoryController.create)
);
CategoryRoute.delete("/:categoryId", controller(CategoryController.delete));

export default CategoryRoute;
