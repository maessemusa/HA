// WebSocket reconnection logic
import { Socket } from 'socket.io-client';

export class SocketReconnectionManager {
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(private socket: Socket) {}

  scheduleReconnect() {
    if (!this.reconnectTimer) {
      this.reconnectTimer = setTimeout(() => {
        console.log('Attempting to reconnect...');
        this.socket.connect();
      }, 2000);
    }
  }

  clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  cleanup() {
    this.clearReconnectTimer();
  }
}