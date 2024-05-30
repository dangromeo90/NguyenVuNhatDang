const express = require('express');
const router = express.Router();
const orderController = require('../../controller/order.controller');

const checkUserLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Chuyển hướng nếu chưa đăng nhập
    }
    next();
};
// Tạo đơn hàng
router.post('/place-order', checkUserLogin, async (req, res) => {
    try {
        const order = await orderController.createOrder(req.session.user._id, req.session.cart);
      
        req.session.cart = []; // Clear cart after creating order
        
        res.redirect('/'); // Redirect to homepage after order creation
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Xem chi tiết đơn hàng
// router.get('/:orderId', checkUserLogin, async (req, res) => {
//     try {
//         const order = await orderController.getOrder(req.params.orderId);
//         res.render('order-detail', { order, user: req.session.user });
//     } catch (error) {
//         console.error('Error fetching order:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// Xem danh sách đơn hàng
// router.get('/', checkUserLogin, async (req, res) => {
//     try {
//         const orders = await orderController.getListOrder();
//         res.render('order-list', { orders, user: req.session.user });
//     } catch (error) {
//         console.error('Error fetching orders:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

module.exports = router;
