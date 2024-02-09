import { Socket } from "socket.io";
import { SocketCommonEventsEnum } from "./common.type";

/**
 * Emit events to all connected sockets
 * @param socket - The socket to emit the event to
 */
export function healthCheck(socket: Socket) {
  const message = 'Service available !';
  socket.emit(SocketCommonEventsEnum.HEALTH_CHECK, message);
}
