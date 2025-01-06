import { io, Socket } from 'socket.io-client';
import { Patient } from '../../types';
import { SOCKET_CONFIG } from './config';
import { setupSocketEvents } from './events';
import { SocketReconnectionManager } from './reconnection';

let socket: Socket | null = null;
let reconnectionManager: SocketReconnectionManager | null = null;

export const initializeSocket = (onQueueUpdate: (patients: Patient[]) => void) => {
  if (!socket) {
    socket = io(SOCKET_CONFIG);
    reconnectionManager = new SocketReconnectionManager(socket);

    const cleanup = setupSocketEvents(
      socket,
      onQueueUpdate,
      () => reconnectionManager?.clearReconnectTimer()
    );

    socket.connect();

    return () => {
      cleanup();
      reconnectionManager?.cleanup();
    };
  }

  return () => {};
};

export const emitQueueUpdate = (patients: Patient[]) => {
  if (socket?.connected) {
    socket.emit('queueUpdate', { patients });
  } else {
    console.warn('Socket not connected, queue update not sent');
    reconnectionManager?.scheduleReconnect();
  }
};