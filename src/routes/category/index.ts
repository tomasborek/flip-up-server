import Router from "express";
import { checkQuery } from "@middlewares/checkQuery";
const router = Router();
import {
  getCategories,
  getCategoriesQuerySchema,
} from "./controllers/getCategories";
import {
  createCategories,
  createCategoriesSchema,
} from "./controllers/createCategories";
import { checkData } from "@middlewares/checkData";

router.post("/", checkData(createCategoriesSchema), createCategories);
router.get("/", checkQuery(getCategoriesQuerySchema), getCategories);

export default router;
