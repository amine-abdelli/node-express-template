/**
 * Represents an HTTP error.
 * Extends the Error class and adds an HTTP status code and a timestamp to the error object.
 */
export class HttpError extends Error {
  httpStatusCode: number;

  timestamp: string;

  /**
   * Creates a new instance of the HttpError class.
   * @param httpStatusCode The HTTP status code of the error.
   * @param message The error message.
   */
  constructor(httpStatusCode: number, message: string) {
    if (message) {
      super(message);
    } else {
      super('An unexpected error occurred!');
    }

    // initializing the class properties
    this.httpStatusCode = httpStatusCode;
    this.timestamp = new Date().toISOString();

    // attaching a call stack to the current class,
    // preventing the constructor call to appear in the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
