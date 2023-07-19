import { Router } from "express";
import UploadController from "@controllers/UploadController";

const UploadRouter = Router();

UploadRouter.get("/listings/:filename", UploadController.getListingImage);
UploadRouter.get("/avatars/:filename", UploadController.getAvatar);
UploadRouter.get("/messages/:filename", UploadController.getMessageImage);

export default UploadRouter;
