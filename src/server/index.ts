import { Server } from 'socket.io';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { CORS_CONFIG, IO_CONFIG } from './socket/config';
import { setupSocketEvents } from './socket/events';

const app = express();
const httpServer = createServer(app);

app.use(cors(CORS_CONFIG));

const io = new Server(httpServer, IO_CONFIG);

io.on('connection', (socket) => {
  setupSocketEvents(io, socket);
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`WebSocket server running on port ${PORT}`);
});