import Router from "express";
const ListingRouter = Router();
import ListingController from "@controllers/ListingController";
import protectedRoute from "@middlewares/protectedRoute";
import { controller } from "@middlewares/controller";
import validate from "@middlewares/validate";
import ListingValidator from "@validators/ListingValidator";
import validateQuery from "@middlewares/validateQuery";
import multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
import { unprotectedRoute } from "@middlewares/unprotectedRoute";

ListingRouter.get(
  "/:listingId",
  unprotectedRoute,
  controller(ListingController.getOne)
);
ListingRouter.get(
  "/",
  unprotectedRoute,
  validateQuery(ListingValidator.getMany),
  controller(ListingController.getMany)
);

ListingRouter.use(protectedRoute);
ListingRouter.post(
  "/",
  validate(ListingValidator.create),
  controller(ListingController.create)
);
ListingRouter.post("/:listingId/likedBy", controller(ListingController.like));
ListingRouter.delete(
  "/:listingId/likedBy",
  controller(ListingController.unlike)
);
ListingRouter.delete("/:listingId", controller(ListingController.delete));
ListingRouter.post(
  "/:listingId/image",
  upload.array("images[]", 6),
  controller(ListingController.addImages)
);

export default ListingRouter;
