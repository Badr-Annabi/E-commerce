const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const adminRoutes = require('./routes/adminRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');


dotenv.config();
const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to DB'))
    .catch( (error) => console.error('MongoDB connection error:', error));

//Route For Admin
app.use('/admin', adminRoutes);

//Route setup
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

//Other routes
app.use('/api/product', productRoutes);
app.use('/api/wishlist', wishlistRoutes);

//Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
