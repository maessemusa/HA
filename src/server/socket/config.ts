import { CorsOptions } from 'cors';
import { ServerOptions } from 'socket.io';

export const CORS_CONFIG: CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true
};

export const IO_CONFIG: Partial<ServerOptions> = {
  cors: CORS_CONFIG,
  path: '/socket.io',
  pingTimeout: 10000,
  pingInterval: 5000
};