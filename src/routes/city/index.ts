import { Router } from "express";
//middlewares
import { protectedRoute } from "@middlewares/protectedRoute";
//controllers
import { getCities } from "./controllers/getCities";
const router = Router();

// ⚙️ GET /city
router.get("/", protectedRoute, getCities);

export default router;
