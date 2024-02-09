import express, { Request, Response, NextFunction } from 'express';
import { loginService, logoutService } from '../services';

const router = express.Router();

/**
 * Login
 * @route /login
 * @method POST
 */
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    return await loginService(req.body, res);
  } catch (error) {
    return next(error);
  }
}

/**
 * Logout
 * @route /logout
 * @method POST
 */
export async function logout(_: Request, res: Response, next: NextFunction) {
  try {
    return logoutService(res);
  } catch (error) {
    return next(error);
  }
}

export default router;
