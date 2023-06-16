import Router from "express";
const router = Router();
import { getAvatar } from "./controllers/getAvatar";
import { getImage } from "./controllers/getImage";
import { getMessageImage } from "./controllers/getMessageImage";

router.get("/avatars/:filename", getAvatar);
router.get("/listings/:filename", getImage);
router.get("/messages/:filename", getMessageImage);

export default router;
