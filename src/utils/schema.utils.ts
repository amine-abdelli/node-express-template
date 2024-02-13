import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

/**
 * Validates the request against a given schema.
 * If the request is valid, the next middleware is called.
 * If the request is invalid, a 400 response with detailed errors is sent.
 *
 * @param schema - The schema to validate against.
 * @returns A middleware function that performs the validation.
 */
export const validateSchema = (
  schema: AnyZodObject,
) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (err: any) {
    const { errors } = err;

    const detailedErrors = errors.map((error: any) => ({
      field: error.path.join('.'),
      message: error.message,
    }));

    return res.status(400).json({
      errors: detailedErrors,
    });
  }
};
