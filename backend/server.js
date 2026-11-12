import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { config } from './src/config/env.js';
import apiRoutes from './src/routes/index.js';
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';

// Load environment configuration
dotenv.config();

const app = express();
const PORT = config.PORT || 5000;

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Enable JSON body parsing for incoming requests
app.use(express.json());

// Health Check Endpoint (Preserved)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'StayFinder backend is running'
  });
});

// Mount Main API Routes
app.use('/api', apiRoutes);

// Catch 404 for undefined routes
app.use(notFound);

// Centralized Global Error Handler
app.use(errorHandler);

// Start Server with resilient port fallback
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`StayFinder backend server is running in ${config.NODE_ENV} mode on port ${port}`);
  });

  server.on('error', (err) => {
    if ((err.code === 'EADDRINUSE' || err.code === 'EACCES') && port === PORT) {
      const fallbackPort = Number(port) + 1;
      console.warn(`Notice: Port ${port} is restricted by OS (${err.code}). Falling back to port ${fallbackPort}...`);
      startServer(fallbackPort);
    } else {
      console.error('Server error:', err);
    }
  });

  return server;
};

startServer(PORT);

export default app;
