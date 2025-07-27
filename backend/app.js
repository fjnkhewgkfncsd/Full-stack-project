import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
import authenRoute from './src/routes/authRoutes.js'
import cartRoutes from './src/routes/cartRoutes.js';
// import orderRoutes from './src/routes/orderRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import favoriteRoutes from './src/routes/favRoutes.js';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authenRoute);
app.use('/api/cart', cartRoutes);
// app.use('/api/order', orderRoutes);
app.use('/api/products',productRoutes);
app.use('/api/favorites', favoriteRoutes);

export default app;