// Extend the Express Request interface to include your context
declare namespace Express {
  export interface Request {
    userId: string;
  }
}
