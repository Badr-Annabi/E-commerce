const express = require('express');
const reviewController = require('../controllers/reviewController');
const {protect} = require("../middlewares/auhMiddleware");


const router = express.Router();

//Add a review to a product
router.post('/:productId', protect, reviewController.addReview);

//Get all reviews for a product
router.get('/:productId', protect, reviewController.getProductReviews);

//Get a specific user's review for a product
router.get('/:productId/user', protect, reviewController.getUserReview);

//Update a user's review for a product
router.put('/:productId', protect, reviewController.updateReview);

//Delete a user's review for a product
router.delete('/:productId', protect, reviewController.deleteReview);

module.exports = router;