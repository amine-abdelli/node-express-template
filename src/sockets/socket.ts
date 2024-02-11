import { Socket } from 'socket.io';

import { log } from 'src/log';
import { commonListener } from './common';
import { onSocketDisconnection } from './utils';
import { notificationListener } from './notification';

import { IO } from './types';

/**
 * Socket connection entry point
 * @param socket - The socket instance
 * @param io - The socket.io server
 * */
export function handleSocketConnection(
  socket: Socket,
  io: IO,
) {
  log.info(`${socket.id} connected !`);

  // List all listeners here
  commonListener(socket, io);
  notificationListener(socket, io);

  socket.on('disconnect', () => {
    log.info(`${socket.id} disconnected !`);
    onSocketDisconnection(socket, io);
  });
}
