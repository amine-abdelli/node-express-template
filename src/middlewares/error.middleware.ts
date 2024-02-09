import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils';
import { log } from 'src/log';

export function errorHandler(err: Error, _: Request, res: Response, next: NextFunction) {
  // default HTTP status code and error message
  let httpStatusCode = 500;
  let message = 'Internal Server Error';

  // if the error is a custom defined error
  if (err instanceof HttpError) {
    httpStatusCode = err.httpStatusCode;
    message = err.message;
  }
  let stackTrace;
  if (process.env.NODE_ENV !== 'production') {
    stackTrace = err.stack;
    if (typeof err === 'string') {
      message = err;
    } else if (err instanceof Error) {
      message = err.message;
    }
  }

  // log the error
  log.error(`[${httpStatusCode}] ${message}`);

  // return the standard error response
  res.status(httpStatusCode).send({
    error: {
      message,
      timestamp: new Date().toISOString() || undefined,
      stackTrace,
    },
  });

  next(err);
}
