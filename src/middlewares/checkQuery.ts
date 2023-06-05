import type { Request, Response, NextFunction } from "express";
import type { ZodObject } from "zod";

export const checkQuery = (schema: ZodObject<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.safeParse(req.query);
    if (!validation.success) {
      return res
        .status(400)
        .send({ validationError: validation.error.format() });
    }
    next();
  };
};
