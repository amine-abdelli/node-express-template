import {
  Request, Response, NextFunction, RequestHandler,
} from 'express';
import jwt from 'jsonwebtoken';
import { HttpError } from '../utils';

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Get the Bearer token from the request header
  const authHeader = req.headers.cookie;
  const token = authHeader && authHeader.split('=')[1];
  if (!token) {
    return res.status(200).json({ message: 'Unauthorized' });
  }
  const JWT_TOKEN_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

  // Verify and decode the Bearer token
  jwt.verify(token, JWT_TOKEN_SECRET, (err, decodedToken) => {
    if (err) throw new HttpError(403, 'Invalid or expired token');
    // Extract the userId from the decoded token and attach it to the request object
    req.userId = (decodedToken as DecodedToken).userId;
    return next();
  });

  return null;
}

// eslint-disable-next-line max-len
const withAuth = (handler: RequestHandler): RequestHandler[] => [authMiddleware, handler];

export { authMiddleware, withAuth };
