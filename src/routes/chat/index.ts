import { Router } from "express";
const router = Router();
//middlewares
import { protectedRoute } from "@middlewares/protectedRoute";
import { checkData } from "@middlewares/checkData";
import { checkQuery } from "@middlewares/checkQuery";
//controllers
import { getChat } from "./controllers/getChat";
import { createChat, chatSchema } from "./controllers/createChat";
import { createMessage, messageSchema } from "./controllers/createMessage";
import { getChats, getChatsQuerySchema } from "./controllers/getChats";
import { getMessages } from "./controllers/getMessages";

// ⬇️ Protected routes
router.use(protectedRoute);

// ⚙️ GET /chat
router.get("/", checkQuery(getChatsQuerySchema), getChats);
// ⚙️ POST /chat
router.post("/", checkData(chatSchema), createChat);

// ⚙️ GET /chat/:chatId
router.get("/:chatId", getChat);
// ⚙️ POST /chat/:chatId/message
router.post("/:chatId", checkData(messageSchema), createMessage);

// ⚙️ GET /chat/:chatId/message
router.get("/:chatId/message", getMessages);

export default router;
