import { Server } from 'socket.io';
import http from 'http';

import { log } from 'src/log';
import { commonListener } from './common';
import { onSocketDisconnection } from './utils';
import { notificationListener } from './notification';

import { IO } from './types';

let io: IO;

type HTTPServer = http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>

/**
 * Initializes the socket.io server and sets up event listeners for socket connections.
 *
 * @param server - The HTTP server instance to attach the socket.io server to.
 * @returns The socket.io server instance.
 */
export const initSocket = (server: HTTPServer) => {
  io = new Server(server);

  io.on('connection', (socket) => {
    log.info(`${socket.id} connected !`);

    // List all event listeners here
    commonListener(socket, io);
    notificationListener(socket, io);

    socket.on('disconnect', () => {
      log.info(`${socket.id} disconnected !`);
      onSocketDisconnection(socket, io);
    });
  });
};

/**
 * Get the socket.io server instance FROM ANYWHERE in socket handlers and
 * REST controllers / services / repositories.
 *
 * @throws Error if the socket.io server has not been initialized.
 */
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
