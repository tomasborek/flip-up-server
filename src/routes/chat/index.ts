import { Router } from "express";
const router = Router();
import { protectedRoute } from "@middlewares/protectedRoute";
import { createChat, chatSchema } from "./controllers/createChat";
import { createMessage, messageSchema } from "./controllers/createMessage";
import { checkData } from "@middlewares/checkData";
import { getChats, getChatsQuerySchema } from "./controllers/getChats";
import { checkQuery } from "@middlewares/checkQuery";
import { getChat } from "./controllers/getChat";
import { getMessages } from "./controllers/getMessages";

router.use(protectedRoute);
router.get("/", checkQuery(getChatsQuerySchema), getChats);
router.get("/:chatId", getChat);
router.post("/", checkData(chatSchema), createChat);
router.post("/:chatId", checkData(messageSchema), createMessage);
router.get("/:chatId/message", getMessages);

export default router;
