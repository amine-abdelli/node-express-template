/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Request, Response, NextFunction } from 'express';
import {
  createUserService, deleteUserService, getUserByIdService,
  updatePasswordService, updateUserByIdService,
} from '../services';

const router = express.Router();

/**
 * Create a user and its related default settings and palmares
 * @route /create
 * @method POST
 */
export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await createUserService(req.body);
    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
}

/**
 * Update one user
 * @route /update
 * @method PUT
 */
export async function updateOneUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { password, ...userRest } = await updateUserByIdService(req.userId, req.body);
    return res.status(200).json({ user: userRest });
  } catch (error) {
    return next(error);
  }
}

/**
 * Get user's data
 * @route /me
 * @method GET
 */
export async function getUserData(req: Request, res: Response, next: NextFunction) {
  try {
    const { password, ...userRest } = await getUserByIdService(req);
    return res.status(200).json(userRest);
  } catch (error) {
    return next(error);
  }
}

/**
 * Delete user and its related settings and palmares
 * @route /delete
 * @method DELETE
 */
export async function deleteOneUser(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteUserService(req);
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return next(error);
  }
}

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function updateUserPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { password, ...userRest } = await updatePasswordService(req);
    return res.status(200).json(userRest);
  } catch (error) {
    return next(error);
  }
}

export default router;
