import { Router } from "express";
const router = Router();
import { auth, authSchema } from "./controllers/auth";
import { checkData } from "src/middlewares/checkData";

router.post("/", checkData(authSchema), auth);

export default router;
