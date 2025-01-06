// WebSocket event handlers
import { Socket } from 'socket.io-client';
import { Patient } from '../../types';

export const setupSocketEvents = (
  socket: Socket,
  onQueueUpdate: (patients: Patient[]) => void,
  onReconnect: () => void
) => {
  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
    onReconnect();
  });

  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('Disconnected from WebSocket server:', reason);
    if (reason === 'io server disconnect') {
      socket.connect();
    }
  });

  socket.on('queueUpdate', (data: { patients: Patient[] }) => {
    onQueueUpdate(data.patients);
  });

  return () => {
    socket.off('connect');
    socket.off('connect_error');
    socket.off('disconnect');
    socket.off('queueUpdate');
  };
};