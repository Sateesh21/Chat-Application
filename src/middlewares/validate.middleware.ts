import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodTypeAny } from 'zod';

const validate = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          errors: error.issues.map((e) => ({
            field: e.path[0],
            message: e.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
};

export default validate;

//Not working
