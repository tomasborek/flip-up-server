import { Router } from "express";
import UploadController from "@controllers/UploadController";
import { controller } from "@middlewares/controller";

const UploadRouter = Router();

UploadRouter.get(
  "/listings/:filename",
  controller(UploadController.getListingImage)
);
UploadRouter.get("/avatars/:filename", controller(UploadController.getAvatar));
UploadRouter.get(
  "/messages/:filename",
  controller(UploadController.getMessageImage)
);

export default UploadRouter;
