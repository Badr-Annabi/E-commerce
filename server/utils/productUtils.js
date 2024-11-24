const Review = require('../models/Review');
const Product = require('../models/Product');


const updateProductRating = async (productId) => {
    const reviews = await Review.find({ product: productId });

    const numReviews = reviews.length;
    const rating = numReviews
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / numReviews : 0;
    await Product.findByIdAndUpdate(productId, { rating, numReviews });
};

module.exports = { updateProductRating };