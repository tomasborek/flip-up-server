import { Router } from "express";
const router = Router();
import multer from "multer";
import { createUser, userSchema } from "./controllers/createUser";
import { checkData } from "src/middlewares/checkData";
import { getUser } from "./controllers/getUser";
import { protectedRoute } from "src/middlewares/protectedRoute";
import { updateUser, updateUserSchema } from "./controllers/updateUser";
import { getUsers, getUsersQuerySchema } from "./controllers/getUsers";
import { checkQuery } from "src/middlewares/checkQuery";
import { addAvatar } from "./controllers/addAvatar";
import { getMe } from "./controllers/getMe";
import { deleteAvatar } from "./controllers/deleteAvatar";
import { followUser } from "./controllers/followUser";
import { unprotectedRoute } from "@middlewares/unprotectedRoute";
import { unfollowUser } from "./controllers/unfollowUser";

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", checkData(userSchema), createUser);
router.get("/", checkQuery(getUsersQuerySchema), unprotectedRoute, getUsers);
router.get("/me", protectedRoute, getMe);
router.get("/:userId", getUser);

router.use(protectedRoute);
router.post("/:userId/avatar", upload.single("avatar"), addAvatar);
router.delete("/:userId/avatar", deleteAvatar);
router.patch("/:userId", checkData(updateUserSchema), updateUser);
router.post("/:userId/follower", followUser);
router.delete("/:userId/follower", unfollowUser);

export default router;
