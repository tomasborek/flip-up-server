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
import UserRepository from "@repositories/UserRepository";
import RatingValidator from "@validators/RatingValidator";
const upload = multer({ storage: multer.memoryStorage() });

const UserRouter = Router();

//POST /user - Create user
UserRouter.post(
  "/",
  validate(UserValidator.create),
  controller(UserController.create)
);

//GET /user - Get many users
UserRouter.get(
  "/",
  unprotectedRoute,
  validateQuery(UserValidator.getMany),
  controller(UserController.getMany)
);

//POST /user/auth - Login
UserRouter.post(
  "/auth",
  validate(UserValidator.login),
  controller(UserController.login)
);

//GET /user/:userId/follower - Get users followers
UserRouter.get(
  "/:userId/follower",
  validateQuery(UserValidator.getFollowers),
  controller(UserController.getFollowers)
);

//GET /user/:userId/following - Get people that user follows
UserRouter.get(
  "/:userId/following",
  validateQuery(UserValidator.getFollowing),
  controller(UserController.getFollowing)
);

//POST /:userId/follower - Follow user
UserRouter.post(
  "/:userId/follower",
  protectedRoute,
  controller(UserController.followUser)
);

//DELETE /:userId/follower - Unfollow user
UserRouter.delete(
  "/:userId/follower",
  protectedRoute,
  controller(UserController.unfollowUser)
);

//GET /user/me - Get data about request user
UserRouter.get("/me", protectedRoute, controller(UserController.getMe));

//PATCH /user/me - Update request user
UserRouter.patch(
  "/me",
  protectedRoute,
  validate(UserValidator.update),
  controller(UserController.update)
);

//PATCH /user/me/password - Update password
UserRouter.patch(
  "/me/password",
  protectedRoute,
  validate(UserValidator.updatePassword),
  controller(UserRepository.updatePassword)
);

//POST /user/:userEmail/reset-password - Send reset email
UserRouter.post("/:userEmail/reset-email", UserController.sendResetEmail);

//POST /user/reset-password/:token - Reset password
UserRouter.post(
  "/reset-password/:token",
  validate(UserValidator.resetPassword),
  controller(UserController.resetPassword)
);

//DELETE /user/me - Delete request user
UserRouter.delete("/me", protectedRoute, controller(UserController.delete));

//POST /user/me/social - Add social to request user
UserRouter.post(
  "/me/social",
  protectedRoute,
  validate(SocialValidator.create),
  controller(UserController.addSocial)
);

//POST /user/me/avatar - Add avatar to request user
UserRouter.post(
  "/me/avatar",
  protectedRoute,
  upload.single("avatar"),
  controller(UserController.addAvatar)
);

//DELETE /user/me/avatar - Remove request users avatar
UserRouter.delete(
  "/me/avatar",
  protectedRoute,
  controller(UserController.deleteAvatar)
);

//POST /user/me/interest - Update request users interests
UserRouter.post(
  "/me/interest",
  protectedRoute,
  validate(UserValidator.updateInterests),
  controller(UserController.updateInterests)
);

//GET /user/me/chat - Get request users chats
UserRouter.get("/chat", protectedRoute, controller(UserController.getChats));

//POST /user/:userId/rating - Create rating for user
UserRouter.post(
  "/:userId/rating",
  protectedRoute,
  validate(RatingValidator.create),
  controller(UserController.createRating)
);

//GET /user/:userId/rating - Get ratings for user
UserRouter.get(
  "/:userId/rating",
  unprotectedRoute,
  validateQuery(RatingValidator.get),
  controller(UserController.getRatings)
);

//POST /user/verify/:token - Verify email with token
UserRouter.post("/verify/:token", UserController.verifyEmail);

export default UserRouter;
