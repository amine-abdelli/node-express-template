/* eslint-disable max-len */
import { Socket } from 'socket.io';
import { sendRoomNotification, sendUserNotification } from './notification.handler';
import { SocketNotificationEventsEnum } from './notification.type';
import { IO } from '../socket';

/**
 * Map notification events to their respective handlers
 **/
const NotificationEventsMap: Record<Partial<SocketNotificationEventsEnum>, (socket: Socket, io: IO, data?: any, _data?: any, __data?: any) => void> = {
  [SocketNotificationEventsEnum.ROOM_NOTIFICATION]: sendRoomNotification,
  [SocketNotificationEventsEnum.SOCKET_NOTIFICATION]: sendUserNotification,
};

/**
 * Listen to notification events from the client and call the appropriate handler.
 * @param socket - The socket instance
 * @param io - The socket.io server
 **/
export function notificationListener(socket: Socket, io: IO) {
  Object.keys(NotificationEventsMap).forEach((event) => {
    const eventName = event as SocketNotificationEventsEnum;
    socket.on(event, (data, _data, __data) => NotificationEventsMap[eventName](socket, io, data, _data, __data));
  });
}
