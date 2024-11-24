const Product = require('../models/Product');
const Review = require('../models/Review');
const {updateProductRating} = require("../utils/productUtils");

// Add a review to a product
exports.addReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.userId;

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Create review
        const review = new Review({
            user: userId,
            product: productId,
            rating,
            comment,
        });

        await review.save();
        //Update Product Rating
        await updateProductRating(productId);

        res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all reviews for a product
exports.getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        // Fetch all reviews for the product
        const reviews = await Review.find({ product: productId }).populate('user', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a user's review for a product (if it exists)
exports.getUserReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.userId;

        // Find user's review for the specific product
        const review = await Review.findOne({ product: productId, user: userId });
        if (!review) return res.status(404).json({ message: 'Review not found' });
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a user's review for a product
exports.updateReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.userId;

        // Find and update review
        const review = await Review.findOneAndUpdate(
            { product: productId, user: userId },
            { rating, comment },
            { new: true }
        );
        if (!review) return res.status(404).json({ message: 'Review not found' });
        res.json({ message: 'Review updated successfully', review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a user's review for a product
exports.deleteReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.userId;

        const review = await Review.findOneAndDelete({ product: productId, user: userId });
        if (!review) return res.status(404).json({ message: 'Review not found' });

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Update Product Rating

