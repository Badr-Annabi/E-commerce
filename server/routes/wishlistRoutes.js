const express = require('express');
const router = express.Router();
const { addToWishlist, removeFromWishlist, getWishlist } = require('../controllers/wishlistController');
const {protect} = require("../middlewares/auhMiddleware");

//Routes
router.post('/', protect ,addToWishlist);
router.post('/remove', protect , removeFromWishlist);
router.get('/', protect , getWishlist);

module.exports = router;