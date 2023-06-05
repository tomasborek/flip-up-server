import type { Request, Response, NextFunction } from "express";
import type { ZodObject } from "zod";

export const checkData = (schema: ZodObject<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({ validationError: validation.error.format() });
    }
    next();
  };
};
