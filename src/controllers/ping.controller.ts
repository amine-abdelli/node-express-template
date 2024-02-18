import { Request, Response, NextFunction } from 'express';

/**
 * Ping server to check if it's up and running
 * This is useful for health checks
 * @path /ping
 * @method GET
 */
export async function ping(_: Request, res: Response, next: NextFunction) {
  try {
    return res.status(200).send({ message: 'Server is up and running' });
  } catch (error) {
    return next(error);
  }
}
