import './config/env.js';

import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from './routes/analytics.route.js';
import wishlistRoutes from './routes/Wishlist.route.js'; 
import orderRoutes from './routes/order.route.js'; 
import userRoutes from './routes/user.route.js';
import saleRoutes from './routes/sale.route.js';
import contactRoutes from './routes/contact.route.js';
import chatbotRoutes from "./routes/chatbot.route.js";

import { connectDB } from './lib/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ NOUVEAU CORS - Autorise toutes les URLs Vercel
const isVercelUrl = (origin) => {
	if (!origin) return false;
	// Autorise toutes les URLs qui contiennent 'daisy-and-more' ET '.vercel.app'
	return origin.includes('daisy-and-more') && origin.includes('.vercel.app');
};

app.use(cors({
	origin: (origin, callback) => {
		// Pas d'origin = requête serveur à serveur (autorisé)
		if (!origin) {
			return callback(null, true);
		}
		
		// Autorise localhost (dev)
		if (origin === 'http://localhost:5173') {
			return callback(null, true);
		}
		
		// Autorise TOUTES les URLs Vercel de ton projet
		if (isVercelUrl(origin)) {
			return callback(null, true);
		}
		
		// Autorise CLIENT_URL (variable d'environnement)
		if (origin === process.env.CLIENT_URL) {
			return callback(null, true);
		}
		
		// Log et refuse les autres
		console.log('❌ CORS blocked origin:', origin);
		callback(new Error('Not allowed by CORS'));
	},
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
	allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/contact', contactRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.get('/api', (req, res) => {
  res.json({ 
    message: 'API is running!',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      coupons: '/api/coupons',
      payments: '/api/payments',
      analytics: '/api/analytics',
      wishlist: '/api/wishlist',
      orders: '/api/orders',
      users: '/api/users',
      sales: '/api/sales',
      contact: '/api/contact',
      chatbot: '/api/chatbot'
    }
  });
});

// Frontend is served separately on Vercel.
// No need to serve frontend files from backend on Render.

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS: Allowing Vercel URLs matching 'daisy-and-more*.vercel.app'`);
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;