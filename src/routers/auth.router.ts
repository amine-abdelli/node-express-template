import express from 'express';
import { withAuth } from '../middlewares/auth.middleware';
import * as AuthController from '../controllers/auth.controller';
import { endpoints } from './routes';

const router = express.Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User login
 *     description: Authenticates a user and returns a token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email.
 *               password:
 *                 type: string
 *                 description: User's password.
 *             example:
 *               email: "user123@mail.com"
 *               password: "Passw0rd123@"
 *     responses:
 *       200:
 *         description: Successfully authenticated. Returns a token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Authentication token.
 *               example:
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad request. Missing email or password.
 *       401:
 *         description: Unauthorized. Incorrect email or password.
 */
router.post(endpoints.auth.login, AuthController.login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User logout
 *     description: Logs out the user and clears the session.
 *     responses:
 *       200:
 *         description: Successfully logged out.
 *       401:
 *         description: Unauthorized. User not logged in.
 */
router.post(endpoints.auth.logout, ...withAuth(AuthController.logout));

export default router;
