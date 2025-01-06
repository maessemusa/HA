import { io, Socket } from 'socket.io-client';
import { Patient } from '../types';

let socket: Socket | null = null;
let reconnectTimer: NodeJS.Timeout | null = null;

const SOCKET_OPTIONS = {
  path: '/socket.io',
  transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
  reconnection: true,
  reconnectionAttempts: Infinity, // Keep trying to reconnect
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000, // Increase timeout to 10s
  autoConnect: false // Don't connect automatically
};

export const initializeSocket = (onQueueUpdate: (patients: Patient[]) => void) => {
  if (!socket) {
    socket = io(SOCKET_OPTIONS);

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error.message);
      
      // Try to reconnect after a delay if not already trying
      if (!reconnectTimer) {
        reconnectTimer = setTimeout(() => {
          console.log('Attempting to reconnect...');
          socket?.connect();
        }, 2000);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from WebSocket server:', reason);
      if (reason === 'io server disconnect') {
        // Server disconnected us, try to reconnect
        socket?.connect();
      }
    });

    // Connect now
    socket.connect();
  }

  // Remove any existing queue update listeners
  socket.off('queueUpdate');

  // Add new queue update listener
  socket.on('queueUpdate', (data: { patients: Patient[] }) => {
    onQueueUpdate(data.patients);
  });

  return () => {
    if (socket) {
      socket.off('queueUpdate');
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    }
  };
};

export const emitQueueUpdate = (patients: Patient[]) => {
  if (socket?.connected) {
    socket.emit('queueUpdate', { patients });
  } else {
    console.warn('Socket not connected, queue update not sent');
  }
};