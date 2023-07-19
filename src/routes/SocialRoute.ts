import { Router } from "express";
import SocialController from "@controllers/SocialController";
import protectedRoute from "@middlewares/protectedRoute";
import SocialValidator from "@validators/SocialValidator";
import validate from "@middlewares/validate";
const SocialRoute = Router();

SocialRoute.use(protectedRoute);

SocialRoute.delete("/:socialId", SocialController.delete);
SocialRoute.put(
  "/:socialId",
  validate(SocialValidator.create),
  SocialController.update
);

export default SocialRoute;
