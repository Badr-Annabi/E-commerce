const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isAdmin } = require('../middlewares/auhMiddleware');
const upload = require('../middlewares/fileUpload');

// Bulk Import Products
router.post('/bulk-import', isAdmin, upload.single('file'), productController.bulkImportProducts);

// Bulk Export Products
router.get('/bulk-export', isAdmin, productController.bulkExportProducts);

module.exports = router;