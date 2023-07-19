import { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject } from "zod";
import { response } from "@utils/response";

function validate(schema: ZodObject<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parse(req.body);
    } catch (e) {
      if (e instanceof ZodError) {
        response({
          res,
          status: 400,
          message: e.message,
        });
        return;
      } else {
        response({
          res,
          status: 500,
          message: "Internal server error",
        });
        return;
      }
    }
    next();
  };
}

export default validate;
