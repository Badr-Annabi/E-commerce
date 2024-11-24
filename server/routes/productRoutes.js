const express = require('express');
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    deleteAllProducts,
    searchAndFilterProducts,
} = require('../controllers/productController');
const {protect} = require("../middlewares/auhMiddleware");

// Routes
router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/search', searchAndFilterProducts);
router.get('/:id', getSingleProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.delete('/', deleteAllProducts);
module.exports = router;