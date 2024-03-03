/* eslint-disable consistent-return */
import {
  Request, Response, NextFunction, RequestHandler,
} from 'express';
import jwt from 'jsonwebtoken';
import { HttpError } from 'src/errors';
import { verifyOauthIdToken } from 'src/utils';

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

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
    verifyOauthIdToken(token).then((userId) => {
      if (userId) {
        req.userId = userId;
        return next();
      }
      throw new HttpError(403, 'Invalid or expired token');
    });
  });
}

/**
 * A helper function to attach the authMiddleware to a request handler
 * This is useful when you want to protect a route with authentication
 */
const withAuth = (handler: RequestHandler): RequestHandler[] => [authMiddleware, handler];

export { authMiddleware, withAuth };
