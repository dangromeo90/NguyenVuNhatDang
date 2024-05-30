const Order = require('../model/order.model');
const User = require('../model/user.model'); // Đảm bảo bạn đã có user.model.js
const Product = require('../model/product.model'); // Đảm bảo bạn đã có product.model.js

class orderController {
    async getListOrder() {
        try {
            const orders = await Order.find()
                .populate('user') // Populate thông tin người dùng
                .populate({
                    path: 'products.product', // Populate thông tin sản phẩm
                    model: 'Product'
                });
            return orders;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createOrder(userId, cart) {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');

            const productDetails = await Promise.all(
                cart.map(async item => {
                    const product = await Product.findById(item.product._id);
                    if (!product) throw new Error('Product not found');
                    return { product: product._id, quantity: item.quantity };
                })
            );

            const totalAmount = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

            const newOrder = new Order({
                user: user._id,
                products: productDetails,
                totalAmount,
                created_by: user.username
            });

            await newOrder.save();
            return newOrder;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new orderController();
