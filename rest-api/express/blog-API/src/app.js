import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// All Routes
import apiRoutes from './routes/index.js';
app.use('/api/v1', apiRoutes);


// Global Error Handling Middleware
import globalErrorhandling from './middlewares/global.error.handling.js';
app.use(globalErrorhandling);

export default app;