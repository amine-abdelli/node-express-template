import { Socket } from 'socket.io';

import { IO } from './socket';

export function onSocketDisconnection(
  socket: Socket,
  io: IO,
) {
  // TODO: Do something !
  return;
}
