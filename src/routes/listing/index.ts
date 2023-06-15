import { Router } from "express";
const router = Router();
import { protectedRoute } from "@middlewares/protectedRoute";
import { checkData } from "@middlewares/checkData";
import { createListing, listingSchema } from "./controllers/createListing";
import { getListings, getListingsQuerySchema } from "./controllers/getListings";
import { addImages } from "./controllers/addImages";
import multer from "multer";
import { getListing } from "./controllers/getListing";
import { checkQuery } from "@middlewares/checkQuery";
import { unprotectedRoute } from "@middlewares/unprotectedRoute";
import { likeListing } from "./controllers/likeListing";
import { unlikeListing } from "./controllers/unlikeListing";
import { deleteListing } from "./controllers/deleteListing";
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get(
  "/",
  checkQuery(getListingsQuerySchema),
  unprotectedRoute,
  getListings
);
router.get("/:listingId", unprotectedRoute, getListing);
router.use(protectedRoute);
router.post("/", checkData(listingSchema), createListing);
router.post("/:listingId/image", upload.array("images[]", 6), addImages);
router.post("/:listingId/likedBy", likeListing);
router.delete("/:listingId/likedBy", unlikeListing);
router.delete("/:listingId", deleteListing);
export default router;
