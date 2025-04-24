# Real-Time Crypto Price Tracker

A responsive React + Redux Toolkit application that tracks real-time cryptocurrency prices with WebSocket integration.

## Features

- Real-time price updates via WebSocket
- Sortable table columns
- Dark mode support
- Connection status monitoring
- Automatic reconnection handling
- Responsive design
- Interactive price charts

## Tech Stack

- Frontend:

  - React with TypeScript
  - Redux Toolkit for state management
  - TailwindCSS for styling
  - Socket.io-client for WebSocket connection
  - Recharts for price charts
  - Heroicons for UI icons

- Backend:
  - Node.js with TypeScript
  - Express.js
  - Socket.io for real-time updates
  - MongoDB for data persistence

## Getting Started

1. Install dependencies:

   ```bash
   npm run install-all
   ```

2. Start the development servers:
   ```bash
   npm start
   ```

This will start both the frontend (port 3000) and backend (port 5000) servers concurrently.

## Environment Variables

### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crypto-tracker
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Project Structure

- `/frontend` - React application
  - `/src/components` - React components
  - `/src/store` - Redux store and slices
- `/backend` - Node.js server
  - `/src/models` - MongoDB models
  - `/src/routes` - API routes

## Features in Detail

### Real-time Updates

- Prices update every 2 seconds
- Color-coded percentage changes
- Automatic reconnection on connection loss

### Table Features

- Sort by any column
- Responsive layout
- 7-day price charts
- Color-coded indicators

### Dark Mode

- System preference detection
- Manual toggle option
- Persistent preference
