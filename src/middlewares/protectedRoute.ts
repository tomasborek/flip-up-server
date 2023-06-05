import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export const protectedRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || "");
    req.user = user as any;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};