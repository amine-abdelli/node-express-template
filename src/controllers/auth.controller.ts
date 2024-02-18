import express, { Request, Response, NextFunction } from 'express';
import { loginService, logoutService } from 'src/services';

const router = express.Router();

/**
 * Login
 * @path /login
 * @method POST
 */
export function login(req: Request, res: Response, next: NextFunction) {
  try {
    return loginService(req.body, res);
  } catch (error) {
    return next(error);
  }
}

/**
 * Logout
 * @path /logout
 * @method POST
 */
export function logout(_: Request, res: Response, next: NextFunction) {
  try {
    return logoutService(res);
  } catch (error) {
    return next(error);
  }
}

export default router;
