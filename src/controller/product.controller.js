const productModel = require('../model/product.model');

class productController {
    async getlistProduct(req, res) {
        const products = await productModel.find();
        return products;
    }

    async getProduct(id) {
        const product = await productModel.findById(id);
        return product;
    }

    async addProduct(req, res) {
        try {
            const productData = req.body;
            if (req.file) {
                productData.thumbnail = req.file.path; // Lưu đường dẫn ảnh vào cơ sở dữ liệu
            }

            console.log(productData); // Kiểm tra dữ liệu sản phẩm

            const newProduct = new productModel(productData);
            await newProduct.save();
            res.redirect('back');
        } catch (error) {
            console.error("Error adding product:", error);
            res.status(500).json({ message: "Error adding product" });
        }
    }

    async updateProduct(req, res) {
        try {
            const productId = req.params.id;
            const updatedProductData = req.body;
            if (req.file) {
                updatedProductData.thumbnail = req.file.path; // Cập nhật đường dẫn ảnh vào cơ sở dữ liệu
            }

            const updatedProduct = await productModel.findByIdAndUpdate(productId, updatedProductData, { new: true });

            if (!updatedProduct) {
                return res.status(404).json({ message: "Product not found" });
            }

            res.redirect('back');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const proID = req.params.id;
            const deletedProduct = await productModel.findByIdAndDelete(proID);
            res.redirect('back');
        } catch (error) {
            console.error("Error deleting product:", error);
            return res.status(500).json({ message: "Error deleting product" });
        }
    }
}

module.exports = new productController();
