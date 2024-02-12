/* eslint-disable max-len */
import { Socket } from 'socket.io';

import { IO } from 'src/sockets/types';
import { SocketCommonEventsEnum } from 'src/sockets/common/common.type';
import { healthCheck } from 'src/sockets/common/common.handler';

/**
 * Map notification events to their respective handlers
 * */
const HealthCheckEventsMap: Record<Partial<SocketCommonEventsEnum>, (socket: Socket, io: IO, data?: any, _data?: any, __data?: any) => void> = {
  [SocketCommonEventsEnum.HEALTH_CHECK]: healthCheck,
};

/**
 * Listen to notification events from the client and call the appropriate handler.
 * @param socket - The socket instance
 * @param io - The socket.io server
 * */
export function commonListener(socket: Socket, io: IO) {
  Object.keys(HealthCheckEventsMap).forEach((event) => {
    const eventName = event as SocketCommonEventsEnum;
    socket.on(event, (data, _data, __data) => HealthCheckEventsMap[eventName](socket, io, data, _data, __data));
  });
}
