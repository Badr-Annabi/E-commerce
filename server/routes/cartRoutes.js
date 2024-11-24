const express = require('express');
const cartController = require('../controllers/cardController');
const { protect } = require('../middlewares/auhMiddleware');


const router = express.Router();

//Add an item to the card
router.post('/add', protect, cartController.addItemToCart);

//Update an item's quantity in the cart
router.put('/update', protect, cartController.updateCartItem);

//Remove an item from the cart
router.delete('/remove/:productId', protect, cartController.removeItemFromCart);

//Get user's cart
router.get('/', protect, cartController.getUserCart);

module.exports = router;