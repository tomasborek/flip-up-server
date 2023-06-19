import { Router } from "express";
const router = Router();
import { protectedRoute } from "src/middlewares/protectedRoute";
import { checkData } from "src/middlewares/checkData";
import { deleteSocial } from "./controllers/deleteSocial";
import { updateSocial, updateSocialSchema } from "./controllers/upateSocial";
router.use(protectedRoute);
router.delete("/:socialId", deleteSocial);
router.patch("/:socialId", checkData(updateSocialSchema), updateSocial);

export default router;
