import Router from "express";
const router = Router();
import { getAvatar } from "./controllers/getAvatar";
import { getImage } from "./controllers/getImage";

router.get("/avatars/:filename", getAvatar);
router.get("/listings/:filename", getImage);

export default router;
