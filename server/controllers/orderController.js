const Order = require('../models/order');


//Create a new Order
exports.createOrder = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;
        const order = new Order ({
            user: req.user.userId,
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
        });
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//Get all Orders for a User
exports.createOrder = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.userId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Update order delivery status
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, {isDelivered: true})
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json({message: 'Order updated successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};