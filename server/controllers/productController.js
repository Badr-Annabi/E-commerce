const fs = require('fs');
const csv = require('csv-parser');
const { Parser } = require('json2csv');
const Product = require('../models/product');
const {deleteFile} = require("../utils/cleanup");

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, umageUrl } = req.body;

        //Check if product already exists
        const existingProduct = await Product.findOne({ name });
        if (product) return res.status(404).json({ message: 'Product Already Exists' });
        res.json(product);
        const product = new Product({name, description, price, category, stock, umageUrl});
        await product.save();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//Get a Single Product
exports.getSingleProduct = async (req, res) => {
    try {
        const productToBeSearched = await Product.findById(req.params.id);
        if (!productToBeSearched) return res.status(404).json({ message: 'Product not found' });
        res.json(productToBeSearched);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//Update a Product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//Delete a Product
exports.deleteProduct = async (req, res) => {
    try {
        product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({message: 'Product deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//Delete all Products
exports.deleteAllProducts = async (req, res) => {
    try {
        await Product.deleteMany();
        res.status(200).json({message: 'Product deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
// Search and Filter Products
exports.searchAndFilterProducts = async (req, res) => {
    try {
        const { name, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
        const filter = {};

        if (name) filter.name = { $regex: name, $options: 'i' };
        if (category) filter.category = category;
        if (minPrice) filter.price = { $gte: minPrice };
        if (maxPrice) filter.price = { ...filter.price, $lte: maxPrice };

        //Implimenting pagination
        const skip = (page - 1) * limit;

        const products = await Product.find(filter)
            .skip(skip)
            .limit(Number(limit));

        const totalProducts = await Product.countDocuments(filter);

        res.status(200).json({
            products,
            totalProducts,

        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

//Bulk import Products
exports.bulkImportProducts = async (req, res) => {
    try {
        const results = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                await Product.insertMany(results);
                deleteFile(req.file.path);
                res.status(201).json({ message: 'Products imported successfully' });
            })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Bulk Export Products
exports.bulkExportProducts = async (req, res) => {
    try {
        const products = await Product.find();
        const fields = ['name', 'description', 'price', 'category', 'stock'];
        const json2csv = new Parser({ fields });
        const csv = json2csv.parse(products);

        res.header('Content-Type', 'text/csv');
        res.attachment('products.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
