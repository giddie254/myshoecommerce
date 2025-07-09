// src/admin/utils/socket.js
import { io } from 'socket.io-client';

let socket;

export const initSocket = (token) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_BASE || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('✅ Connected to socket server');
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from socket server');
    });
  }
  return socket;
};

export const getSocket = () => socket;
