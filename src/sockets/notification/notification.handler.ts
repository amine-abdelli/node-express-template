import { Socket } from 'socket.io';
import { SocketNotificationEventsEnum } from './notification.type';
import { IO } from '../types';

/**
 * Emit notification events to a specific room
 * @param io - The socket.io server
 * @param roomId - The room id to emit the event to
 * @param message - The notification message to send
 * */

export function sendRoomNotification(_: Socket, io: IO, roomId: string, message: string) {
  return io.to(roomId).emit(SocketNotificationEventsEnum.ROOM_NOTIFICATION, { message });
}

/**
 * Emit notification events to a specific user/socket
 * @param io - The socket.io server
 * @param userId - The user id to emit the event to
 * @param message - The notification message to send
 * */
export function sendUserNotification(_: Socket, io: IO, userId: string, message: string) {
  return io.to(userId).emit(SocketNotificationEventsEnum.SOCKET_NOTIFICATION, { message });
}
