const express = require('express');
const router = express.Router();
const productController = require('../../controller/product.controller');
const multer = require('multer');
const path = require('path'); // Import the path module

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'admin/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Get list product
router.get('/list-product', productController.getlistProduct);

// Get product by id
router.get('/get-product/:id', productController.getProduct);

// Add product
router.post('/add-product', upload.single('thumbnail'), productController.addProduct);

// Update product
router.post('/update-product/:id', upload.single('thumbnail'), productController.updateProduct);

// Delete product
router.post('/delete-product/:id', productController.deleteProduct);

module.exports = router;
