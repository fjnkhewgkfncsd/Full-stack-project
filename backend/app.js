import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
require('dotenv').config();
import authenRoute from './src/routes/authRoutes.js'

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authenRoute);

export default app;