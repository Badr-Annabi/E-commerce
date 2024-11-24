const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
    imageUrl: {
        type: String,
    },
    ratings: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    reviews: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
