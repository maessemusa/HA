import { Server, Socket } from 'socket.io';
import { Patient } from '../../types';

export const setupSocketEvents = (io: Server, socket: Socket) => {
  console.log('Client connected:', socket.id);

  socket.emit('connected', { message: 'Successfully connected to server' });

  socket.on('queueUpdate', (data: { patients: Patient[] }) => {
    io.emit('queueUpdate', data);
  });

  socket.on('disconnect', (reason) => {
    console.log('Client disconnected:', socket.id, 'Reason:', reason);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
};