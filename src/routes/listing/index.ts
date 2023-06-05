import { Router } from "express";
const router = Router();
import { protectedRoute } from "@middlewares/protectedRoute";
import { checkData } from "@middlewares/checkData";
import { createListing, listingSchema } from "./controllers/createListing";
import { getListings } from "./controllers/getListings";
import { addImages } from "./controllers/addImages";
import multer from "multer";
import { getListing } from "./controllers/getListing";
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", getListings);
router.get("/:listingId", getListing);
router.use(protectedRoute);
router.post("/", checkData(listingSchema), createListing);
router.post("/:listingId/image", upload.array("images[]", 6), addImages);
export default router;
