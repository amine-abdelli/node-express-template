import express from 'express';
import { withAuth } from '../middlewares/auth.middleware';
import * as AuthController from '../controllers/auth.controller';
import { endpoints } from './routes';

const router = express.Router();

router.post(endpoints.auth.login, AuthController.login);
router.post(endpoints.auth.logout, ...withAuth(AuthController.logout));

export default router;
