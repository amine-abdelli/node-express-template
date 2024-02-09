import express from 'express';
import { withAuth } from '../middlewares/auth.middleware';
import * as UserController from '../controllers/user.controller';
import { endpoints } from './routes';

const router = express.Router();

router.post(endpoints.user.create, UserController.createUser);
router.put(endpoints.user.update, ...withAuth(UserController.updateOneUser));
router.get(endpoints.user.me, ...withAuth(UserController.getUserData));
router.post(endpoints.user.delete, ...withAuth(UserController.deleteOneUser));
router.post(endpoints.user.update_password, ...withAuth(UserController.updateUserPassword));

export default router;
