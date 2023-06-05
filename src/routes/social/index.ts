import { Router } from "express";
const router = Router();
import { createSocial, socialSchema } from "./controllers/createSocial";
import { protectedRoute } from "src/middlewares/protectedRoute";
import { checkData } from "src/middlewares/checkData";
import { deleteSocial } from "./controllers/deleteSocial";
import { updateSocial, updateSocialSchema } from "./controllers/upateSocial";
router.use(protectedRoute);
router.post("/", checkData(socialSchema), createSocial);
router.delete("/:socialId", deleteSocial);
router.patch("/:socialId", checkData(updateSocialSchema), updateSocial);

export default router;
