import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import apiRouter from './routes/apiRoutes.js';
import propertyRouter from './routes/propertyRoutes.js';
import roomRouter from './routes/roomRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import bookingRouter from './routes/bookingRoutes.js';
import availabilityRouter from './routes/availabilityRoutes.js';
import authRouter from './routes/authRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Enable CORS for frontend origin
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};

// console.log(process.env.FRONTEND_URL)
app.use(cors(corsOptions));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register base health/API routes
app.use('/api', apiRouter);
app.use('/api/properties', propertyRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/availability', availabilityRouter);
app.use('/api/auth', authRouter);


// Root entry point helper redirect
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to Homestay Inventory Checker API. Access status at /api/health"
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
