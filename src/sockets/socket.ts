import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';


import { log } from 'src/log';

import { onSocketDisconnection } from './utils';
import { commonListener } from './common';
import { notificationListener } from './notification';


export type IO = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>

/**
 * Socket connection entry point
 * @param socket - The socket instance
 * @param io - The socket.io server
 **/
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
