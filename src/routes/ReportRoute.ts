import ReportController from "@controllers/ReportController";
import { adminProtectedRoute } from "@middlewares/adminProtectedRoute";
import { controller } from "@middlewares/controller";
import protectedRoute from "@middlewares/protectedRoute";
import validateQuery from "@middlewares/validateQuery";
import ReportValidator from "@validators/ReportValidator";
import { Router } from "express";

const ReportRouter = Router();

//POST /report/ - Create a report
ReportRouter.post("/", protectedRoute, controller(ReportController.create));

//GET /report/ - Get all reports
ReportRouter.get(
  "/",
  adminProtectedRoute,
  validateQuery(ReportValidator.findMany),
  controller(ReportController.findMany)
);

//GET /report/:reportId - Get a report by id
ReportRouter.get(
  "/:reportId",
  adminProtectedRoute,
  controller(ReportController.findOne)
);

//DELETE /report/:reportId - Delete a report by id
ReportRouter.delete(
  "/:reportId",
  adminProtectedRoute,
  controller(ReportController.delete)
);

export default ReportRouter;
