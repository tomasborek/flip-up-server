import ChatController from "@controllers/ChatController";
import { controller } from "@middlewares/controller";
import protectedRoute from "@middlewares/protectedRoute";
import validate from "@middlewares/validate";
import validateQuery from "@middlewares/validateQuery";
import ChatValidator from "@validators/ChatValidator";
import MessageValidator from "@validators/MessageValidator";
import { Router } from "express";
const ChatRouter = Router();
ChatRouter.use(protectedRoute);
ChatRouter.post("/", controller(ChatController.create));
ChatRouter.get("/:chatId", ChatController.getOne);
ChatRouter.get(
  "/:chatId/message",
  validateQuery(MessageValidator.get),
  controller(ChatController.getMessages)
);
ChatRouter.post(
  "/:chatId/message",
  validate(MessageValidator.create),
  controller(ChatController.sendMessage)
);

export default ChatRouter;
