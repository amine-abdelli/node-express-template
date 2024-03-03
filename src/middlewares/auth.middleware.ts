/* eslint-disable consistent-return */
import {
  Request, Response, NextFunction, RequestHandler,
} from 'express';
import jwt from 'jsonwebtoken';
import { HttpError } from 'src/errors';
import { getUserIdFromOAuthIdToken } from 'src/utils';

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

/**
 * Middleware function to authenticate requests.
 * It checks for a valid token in the request headers and verifies it using JWT.
 * If the token is valid, it sets the userId in the request object and calls the next middleware.
 * If the token is invalid or missing, it returns an "Unauthorized" response.
 * If the JWT verification fails, it attempts to verify the token as a Google OAuth token.
 * If the Google OAuth verification succeeds, it sets the userId in the request object and calls
 * the next middleware.
 * If the Google OAuth verification fails, it throws an HttpError with status code 403.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 */
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.cookie;

  const token = authHeader && authHeader.split('=')[1];

  if (!token) {
    return res.status(200).json({ message: 'Unauthorized' });
  }

  const JWT_TOKEN_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

  jwt.verify(token, JWT_TOKEN_SECRET, (jwtErr, decodedToken) => {
    if (!jwtErr && decodedToken) {
      req.userId = (decodedToken as DecodedToken).userId;
      return next();
    }

    // If JWT verification fails, attempt to verify as a Google OAuth token
    getUserIdFromOAuthIdToken(token).then((userId) => {
      if (userId) {
        req.userId = userId;
        return next();
      }
      throw new HttpError(403, 'Invalid or expired token');
    }).catch((err) => {
      next(err);
    });
  });
}

/**
 * A helper function to attach the authMiddleware to a request handler
 * This is useful when you want to protect a route with authentication
 */
const withAuth = (handler: RequestHandler): RequestHandler[] => [authMiddleware, handler];

export { authMiddleware, withAuth };
