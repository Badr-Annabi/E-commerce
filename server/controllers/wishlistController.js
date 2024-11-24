const User = require('../models/user');
const Product = require('../models/product');

// Add to Wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { productId } = req.body;

        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save;
            return res.status(200).json({ message: 'Product added to wishlist!', wishlist: user.wishlist });
        }

        res.status(400).json({ message: 'Product already in wishlist!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Remove from Wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const user = await  User.findById(req.user._id);
        const { productId } = req.body;

        user.wishlist = user.wishlist.filter(item => item.toString() !== productId);
        await user.save();
        res.status(200).json({ message: 'Product removed from wishlist!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get Wishlist
exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');
        res.status(200).json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}