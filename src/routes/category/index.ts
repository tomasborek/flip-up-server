import Router from "express";
import { checkQuery } from "@middlewares/checkQuery";
const router = Router();
import {
  getCategories,
  getCategoriesQuerySchema,
} from "./controllers/getCategories";
import { checkData } from "@middlewares/checkData";
import { deleteCategory } from "./controllers/deleteCategory";
import { createCategory, categorySchema } from "./controllers/createCategory";
import { adminProtectedRoute } from "@middlewares/adminProtectedRoute";

router.get("/", checkQuery(getCategoriesQuerySchema), getCategories);
router.use(adminProtectedRoute);
router.delete("/:categoryId", deleteCategory);
router.post("/", checkData(categorySchema), createCategory);

export default router;
