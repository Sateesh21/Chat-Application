import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';

const validate = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Somthing went wrong",
        });
        return;
      }
      next(error);
    }
  };
};

export default validate;