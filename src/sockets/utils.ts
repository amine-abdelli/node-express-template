/* eslint-disable @typescript-eslint/no-unused-vars */
import { Socket } from 'socket.io';
import { IO } from './types';

/**
 * Handle socket disconnection
 * @param socket - The socket instance
 * @param io - The socket.io server
 * */
export function onSocketDisconnection(
  socket: Socket,
  io: IO,
) {
  // TODO: Do something !
}
