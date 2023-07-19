import { Router } from "express";
const MessageRouter = Router();
import MessageController from "@controllers/MessageController";
import protectedRoute from "@middlewares/protectedRoute";
import multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

MessageRouter.post(
  "/:messageId/image",
  protectedRoute,
  upload.single("image"),
  MessageController.addImage
);

export default MessageRouter;
