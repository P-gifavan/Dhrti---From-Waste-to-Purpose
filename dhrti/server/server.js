require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');
const contactRoutes = require('./routes/contactRoutes');
const sellerListingRoutes = require('./routes/sellerListingRoutes');
const sellerRequestRoutes = require('./routes/sellerRequestRoutes');
const sellerAnalyticsRoutes = require('./routes/sellerAnalyticsRoutes');
const profileRoutes = require('./routes/profileRoutes');
const buyerRequestRoutes = require('./routes/buyerRequestRoutes');
const buyerSavedListingRoutes = require('./routes/buyerSavedListingRoutes');
const buyerAnalyticsRoutes = require('./routes/buyerAnalyticsRoutes');

const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
  });
});

const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
// const chatRoutes = require('./routes/chatRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Setup Routes here later...
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/seller/listings', sellerListingRoutes);
app.use('/api/seller/analytics', sellerAnalyticsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/buyer/saved-listings', buyerSavedListingRoutes);
app.use('/api/buyer/analytics', buyerAnalyticsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
// app.use('/api/ai', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/wishlist', buyerSavedListingRoutes); // Alias for exact API spec

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
