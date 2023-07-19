import CityController from "@controllers/CityController";
import validateQuery from "@middlewares/validateQuery";
import CityValidator from "@validators/CityValidator";
import { Router } from "express";
const CityRouter = Router();

CityRouter.get("/", validateQuery(CityValidator.getAll), CityController.getAll);

export default CityRouter;
