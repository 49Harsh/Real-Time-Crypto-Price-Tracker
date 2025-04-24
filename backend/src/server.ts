import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const allowedOrigins = (process.env.FRONTEND_URLS || 'http://localhost:3000').split(',');

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crypto-tracker')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  // Simulate real-time price updates
  const updateInterval = setInterval(() => {
    const cryptos = ['bitcoin', 'ethereum', 'tether', 'bnb', 'solana'];
    cryptos.forEach(crypto => {
      const randomChange = (Math.random() - 0.5) * 200;
      socket.emit('priceUpdate', {
        id: crypto,
        price: Math.abs(randomChange * 100),
        priceChanges: {
          '1h': (Math.random() - 0.5) * 2,
          '24h': (Math.random() - 0.5) * 5,
          '7d': (Math.random() - 0.5) * 10
        }
      });
    });
  }, 2000);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    clearInterval(updateInterval);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Allowed origins:', allowedOrigins);
});