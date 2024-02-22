import express, { Request, Response, NextFunction } from 'express';
import { loginService, logoutService } from 'src/services';

const router = express.Router();

/**
 * Login
 * @path /login
 * @method POST
 */
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    await loginService(req.body, res);
  } catch (error) {
    next(error);
  }
}

/**
 * Logout
 * @path /logout
 * @method POST
 */
export async function logout(_: Request, res: Response, next: NextFunction) {
  try {
    await logoutService(res);
  } catch (error) {
    next(error);
  }
}

export default router;
