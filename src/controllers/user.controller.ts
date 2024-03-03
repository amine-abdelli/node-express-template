/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Request, Response, NextFunction } from 'express';
import { omit } from 'lodash';
import {
  createUserService, deleteUserService, getUserByIdService, updatePasswordService,
  updateUserByIdService,
} from 'src/services';

const router = express.Router();

/**
 * Create a user and its related default settings and palmares
 * @path /user/create
 * @method POST
 * @public route
 */
export async function createOneUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await createUserService(req.body);
    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
}

/**
 * Update one user
 * @path /user/update
 * @method PUT
 * @protected with authentication
 */
export async function updateOneUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await updateUserByIdService(req.userId, req.body);
    return res.status(200).json({ user: omit(user, 'password') });
  } catch (error) {
    return next(error);
  }
}

/**
 * Get user's data
 * @path /user/me
 * @method GET
 * @protected with authentication
 */
export async function getOneUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await getUserByIdService(req);
    return res.status(200).json(omit(user, 'password'));
  } catch (error) {
    return next(error);
  }
}

/**
 * Delete user and its related settings and palmares
 * @path /user/delete
 * @method DELETE
 * @protected with authentication
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
 * Update user's password
 * @path /user/update-password
 * @method PUT
 * @protected with authentication
 */
export async function updateUserPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await updatePasswordService(req);
    return res.status(200).json(omit(user, 'password'));
  } catch (error) {
    return next(error);
  }
}

export default router;
