import Router from "express";
import multer from "multer";
import { protectedRoute } from "@middlewares/protectedRoute";
import { addMessageImage } from "./controllers/addMessageImage";
const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(protectedRoute);
router.post("/:messageId/image", upload.single("image"), addMessageImage);
export default router;
