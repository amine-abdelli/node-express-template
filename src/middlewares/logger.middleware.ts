import { NextFunction, Response, Request } from 'express';
import { log } from 'src/log';

/**
 * Middleware function that logs request information and duration.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function to call in the middleware chain.
 */
export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    log.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms - user : ${req?.userId || 'un-authenticated user'}`);
  });

  next();
}
