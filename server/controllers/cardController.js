const Cart = require('../models/cart');
const Product = require('../models/product');

//Add item to Cart
exports.addItemToCart = async (req, res) => {
    try {
        const {productId, quantity} = req.body;
        const userId = req.user.userId;

        //Check if product exists
        const product = await Product.findById(productId)
        if (!product) return res.status(404).json({message: 'Product not found'});

        // Check if cart already contains product
        let cart = await Cart.findOne({user: userId});
        if (!cart) return res.status(404).json({message: 'Cart not found'});

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex >= 0) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({product: productId, quantity});
        }

        await cart.save();
        res.json({message: 'Item added successfully.', cart});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

    //Update item quantity in cart
exports.updateCartItem = async (req, res) => {
    try {
        const {productId, quantity} = req.body;
        const userId = req.user.userId;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) return res.status(404).json({ message: 'Product not in cart' });

        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        res.json({ message: 'Cart item updated', cart });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Remove item from cart
exports.removeItemFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.userId;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        res.json({ message: 'Item removed from cart', cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user cart
exports.getUserCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.userId }).populate('items.product');
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Clear the Cart
exports.clearCart = async (req, res) => {
    try {
        const user = req.user.userId;
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = [];
        await cart.save();
        res.json({ message: 'Cart cleared', cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cart Summary
exports.getCartSummary = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const total = cart.items.reduce((acc, item) => acc + item.product.price*item.quantity, 0);
        const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

        res.json({ total, itemCount, message: 'Cart Summary' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
