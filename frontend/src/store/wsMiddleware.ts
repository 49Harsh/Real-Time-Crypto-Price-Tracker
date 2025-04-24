import { Middleware } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';
import { updatePrices, setError, setConnectionStatus } from './cryptoSlice';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
const RECONNECTION_ATTEMPTS = 3;
const RECONNECTION_DELAY = 3000;

export const wsMiddleware: Middleware = (store) => {
  let socket: Socket;
  let reconnectAttempts = 0;

  const connectWebSocket = () => {
    socket = io(SOCKET_URL, {
      reconnection: false // We'll handle reconnection manually
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
      store.dispatch(setConnectionStatus('connected'));
      store.dispatch(setError(null));
      reconnectAttempts = 0;
    });

    socket.on('priceUpdate', (data) => {
      store.dispatch(updatePrices(data));
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      store.dispatch(setConnectionStatus('disconnected'));
      handleReconnection();
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      store.dispatch(setConnectionStatus('error'));
      store.dispatch(setError('Failed to connect to the server'));
      handleReconnection();
    });
  };

  const handleReconnection = () => {
    if (reconnectAttempts < RECONNECTION_ATTEMPTS) {
      reconnectAttempts++;
      store.dispatch(setConnectionStatus('reconnecting'));
      store.dispatch(setError(`Attempting to reconnect (${reconnectAttempts}/${RECONNECTION_ATTEMPTS})...`));
      
      setTimeout(() => {
        socket.close();
        connectWebSocket();
      }, RECONNECTION_DELAY);
    } else {
      store.dispatch(setConnectionStatus('failed'));
      store.dispatch(setError('Connection failed after multiple attempts. Please try again later.'));
    }
  };

  return (next) => (action) => {
    if (!socket) {
      connectWebSocket();
    }
    return next(action);
  };
};