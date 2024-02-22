/* eslint-disable max-len */
import express from 'express';
import { validateSchema } from 'src/middlewares/schema.middleware';
import {
  CreateUserSchema, DeleteUserSchema, UpdatePasswordSchema, UpdateUserSchema,
} from 'src/schemas';
import { withAuth } from 'src/middlewares/auth.middleware';
import * as UserController from 'src/controllers/user.controller';
import { endpoints } from 'src/routers/routes';

const router = express.Router();

router.post(endpoints.user.create, validateSchema(CreateUserSchema), UserController.createOneUser);
router.put(endpoints.user.update, validateSchema(UpdateUserSchema), ...withAuth(UserController.updateOneUser));
router.get(endpoints.user.me, ...withAuth(UserController.getOneUser));
router.delete(endpoints.user.delete, validateSchema(DeleteUserSchema), ...withAuth(UserController.deleteOneUser));
router.put(endpoints.user.update_password, validateSchema(UpdatePasswordSchema), ...withAuth(UserController.updateUserPassword));

export default router;
