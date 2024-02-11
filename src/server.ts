import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { handleSocketConnection } from './sockets/socket';
import Routers from './routers';
import { errorHandler } from './middlewares';
import { HttpError } from './utils';
import { log } from './log';
import { swaggerOptions } from './utils/openapi.utils';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

dotenv.config({ path: './.env.local' });

app.use(express.json());

const whitelist = [
  process.env.API_URL || 'http://localhost:4000',
  process.env.WEB_FRONTEND_URL || 'http://localhost:3000',
  process.env.MOBILE_FRONTEND_URL,
];

const corsOptions = {
  origin(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (whitelist.includes(origin || '') || !origin) {
      callback(null, true);
    } else {
      callback(new HttpError(403, 'Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type'],
};

/**
 * This is a very basic rate limiter to avoid extreme attack usecases
 * but you can setup a rate limit depending on query complexity
 */
const limiter = rateLimit({
  windowMs: 10 * 1000, // ten seconds in milliseconds
  max: 100, // limit each IP to 100 req / 10sec
  onLimitReached: (req: express.Request) => {
    log.warn('Rate limit exceeded', { ip: req.ip || 'unknown' });
  },
  message: { message: 'Too many requests, please try again later.', status: 429 },
});

/**
 * Apply rate limiter to all requests
 */
app.use(limiter);

/**
 * Allow CORS
 */
app.use(cors(corsOptions));

/**
 * Routers
 */
Routers.map(({ route, router }) => app.use(route, router));

/**
 * Error handling layer
 */
app.use(errorHandler);

/**
 * Basic swagger setup
 * Available by default at localhost:4000/api-docs
 * @see https://www.npmjs.com/package/swagger-ui-express
 */
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJSDoc(swaggerOptions)));

/**
 * Socket entry point
 */
io.on('connection', (socket: Socket) => handleSocketConnection(socket, io));

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  log.info(`Server running on port ${PORT}
                          Press CTRL-C to stop`);
});
