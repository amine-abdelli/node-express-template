import express, { Request, Response, NextFunction } from 'express';
import {
  loginService, logoutService, oauthCallBackService, oauthLoginService,
} from 'src/services';

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

/**
 * OAuth login
 * @path /oauth/login
 * @method POST
 */
export async function oauthLogin(req: Request, res: Response, next: NextFunction) {
  try {
    await oauthLoginService(req, res);
  } catch (error) {
    next(error);
  }
}

/**
 * OAuth callback
 * @path /oauth/callback
 * @method GET
 */
export async function oauthCallback(req: Request, res: Response, next: NextFunction) {
  try {
    await oauthCallBackService(req, res);
  } catch (error) {
    next(error);
  }
}

export default router;
