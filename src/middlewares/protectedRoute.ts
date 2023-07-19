import UserRepository from "@repositories/UserRepository";
import { validateToken } from "@utils/jwt";
import { Request, Response, NextFunction } from "express";
import { response } from "@utils/response";

export default async function auth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.headers.authorization?.includes("Bearer")) {
    response({
      res,
      status: 401,
      message: "Authorization header malformed",
    });
    return;
  }

  if (req.headers.authorization?.split(" ").length != 2) {
    response({
      res,
      status: 401,
      message: "Authorization header malformed",
    });
    return;
  }

  const token = req.headers.authorization?.split(" ")[1];

  const jwtPayload = validateToken(token);

  if (!jwtPayload) {
    response({ res, status: 401, message: "Invalid token" });
    return;
  }

  const user = await UserRepository.findByEmail(jwtPayload.email);

  if (!user) {
    response({ res, status: 401, message: "Invalid token" });
    return;
  }

  req.user = user;
  next();
}
