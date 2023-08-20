import ResetTokenController from "@controllers/ResetTokenController";
import { Router } from "express";
const ResetTokenRouter = Router();

ResetTokenRouter.get("/:token", ResetTokenController.findOne);

export default ResetTokenRouter;
