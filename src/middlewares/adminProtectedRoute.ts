import type { Request, Response, NextFunction } from "express";
import { protectedRoute } from "./protectedRoute";

const adminProtectedRouteMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user.admin) {
    res.status(403).json({ message: "Forbidden" });
  }
  next();
};

export const adminProtectedRoute = [
  protectedRoute,
  adminProtectedRouteMiddleware,
];
