import { Request, Response, NextFunction } from 'express';

/**
 * Health check
 * @path /health-check
 * @method GET
 */
export async function check(req: Request, res: Response, next: NextFunction) {
  try {
    return res.status(200).send({ message: 'OK' });
  } catch (error) {
    return next(error);
  }
}
