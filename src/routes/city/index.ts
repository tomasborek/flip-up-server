import { Router } from "express";
import { getCities } from "./controllers/getCities";
const router = Router();

router.get("/", getCities);

export default router;
