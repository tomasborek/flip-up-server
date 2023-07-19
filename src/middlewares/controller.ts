import { Request, Response, NextFunction } from "express";
import { response } from "@utils/response";

export const controller = (func: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (e) {
      console.log(e);
      response({
        res,
        status: 500,
        message: "Internal server error",
      });
      return;
    }
  };
};
