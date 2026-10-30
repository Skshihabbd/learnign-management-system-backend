import { ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateRequest =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse( req.body );
      next();
    } catch (err) {
      next(err); // 🔥 IMPORTANT
    }
  };