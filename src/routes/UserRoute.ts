import { controller } from "@middlewares/controller";
import validate from "@middlewares/validate";
import { Router } from "express";
import UserValidator from "src/validators/UserValidators";
import UserController from "@controllers/UserController";
import protectedRoute from "@middlewares/protectedRoute";
import validateQuery from "@middlewares/validateQuery";
import SocialValidator from "@validators/SocialValidator";
import multer from "multer";
import { unprotectedRoute } from "@middlewares/unprotectedRoute";
const upload = multer({ storage: multer.memoryStorage() });

const UserRouter = Router();

UserRouter.post(
  "/",
  validate(UserValidator.create),
  controller(UserController.create)
);

UserRouter.get(
  "/",
  unprotectedRoute,
  validateQuery(UserValidator.getMany),
  controller(UserController.getMany)
);

UserRouter.post(
  "/auth",
  validate(UserValidator.login),
  controller(UserController.login)
);

UserRouter.get(
  "/:userId/follower",
  validateQuery(UserValidator.getFollowers),
  controller(UserController.getFollowers)
);
UserRouter.get(
  "/:userId/following",
  validateQuery(UserValidator.getFollowing),
  controller(UserController.getFollowing)
);

UserRouter.use(protectedRoute);
UserRouter.post("/:userId/follower", controller(UserController.followUser));

UserRouter.get("/me", controller(UserController.getMe));
UserRouter.patch(
  "/me",
  validate(UserValidator.update),
  controller(UserController.update)
);
UserRouter.delete("/:userId", controller(UserController.delete));
UserRouter.post(
  "/social",
  validate(SocialValidator.create),
  controller(UserController.addSocial)
);

UserRouter.post(
  "/avatar",
  upload.single("avatar"),
  controller(UserController.addAvatar)
);
UserRouter.delete("/avatar", controller(UserController.deleteAvatar));

UserRouter.post(
  "/interest",
  validate(UserValidator.updateInterests),
  controller(UserController.updateInterests)
);

UserRouter.get("/chat", controller(UserController.getChats));

export default UserRouter;
