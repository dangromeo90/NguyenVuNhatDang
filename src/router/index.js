const express = require('express');
const router = express.Router();
const path = require('path');
// Đường dẫn tới file chứa controller 
const productController = require('../controller/product.controller');
const userController = require('../controller/user.controller');
const orderController = require('../controller/order.controller');

router.use('/api/v1/product', require('./product/index'));
router.use('/api/v1/user', require('./user/index'));
router.use('/api/v1/order', require('./order/index'));
// Middleware để kiểm tra đăng nhập
const checkAdminLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/admin/login'); // Chuyển hướng nếu chưa đăng nhập
    }
    next();
};

// Trang index
router.get('/', async (req, res) => {
    const indexView = path.join(__dirname, '../views/index.ejs');
    const products = await productController.getlistProduct();
    res.render(indexView, { data: products, user: req.session.user });
});

// Trang chi tiết sản phẩm 
router.get('/product-detail/:id', async (req, res) => {
    const detailView = path.join(__dirname, '../views/product-detail.ejs');
    const proID = req.params.id;
    const product = await productController.getProduct(proID);
    res.render(detailView, { product, user: req.session.user });
});

// Trang chủ admin
router.get('/admin', checkAdminLogin, async (req, res) => {
    const indexView = path.join(__dirname, '../views/admin.ejs');
    res.render(indexView, { user: req.session.user });
});

// Trang quản lý sản phẩm
router.get('/admin/products', checkAdminLogin, async (req, res) => {
    const productView = path.join(__dirname, '../views/product-manage.ejs');
    const products = await productController.getlistProduct();
    res.render(productView, { data: products, user: req.session.user });
});

// Trang đăng nhập admin
router.get('/admin/login', async (req, res) => {
    const loginView = path.join(__dirname, '../views/signin.ejs');
    res.render(loginView);
});

//Xử lý đăng nhâp
router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await userController.userLogin(username, password);
    if (user) {
        if (user.role === 'Admin') {
            req.session.user = user; // Lưu session
            res.redirect('/admin');
        } else {
            // Sử dụng alert để thông báo lỗi
            res.send('<script>alert("Bạn không có quyền truy cập vào trang admin."); window.location.href = "/admin/login";</script>');
        }
    } else {
        res.send('<script>alert("Sai Username hoặc mật khẩu."); window.location.href = "/admin/login";</script>');
    }
});


// Đăng xuất admin
router.get('/admin/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/admin/login'); // Chuyển hướng đến trang đăng nhập sau khi xóa session
    });
});

// Kiểm tra session
router.get('/check-session', (req, res) => {
    if (req.session && req.session.user) {
        // Session tồn tại và có thông tin người dùng
        res.send('Session is active. User data: ' + JSON.stringify(req.session.user));
    } else {
        // Không có session hoặc session không có thông tin người dùng
        res.send('No active session.');
    }
});
// Trang quản lý user
router.get('/admin/users', async (req, res) => {
    const userView = path.join(__dirname, '../views/user-manage.ejs');
    const users = await userController.getListUser();
    res.render(userView, { data: users, user: req.session.user });
});

// Trang đăng ký user
router.get('/signup' , async (req, res) =>{
    const signupView = path.join(__dirname ,'../views/signup.ejs');
    res.render(signupView);
})

// Trang dang nhập khách hàng
router.get('/login', async (req, res) => {
    const loginView = path.join(__dirname, '../views/login.ejs');
    res.render(loginView);
});
// Xử lý đăng nhập khách hàng 
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await userController.userLogin(username, password);
    if (user) {
        req.session.user = user; // Lưu session
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});
// Đăng xuất khách hàng
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/'); // Chuyển hướng đến trang đăng nhập sau khi xóa session
    });
});

// Trang cart
router.get('/cart', (req, res) => {
    const viewCart = path.join(__dirname, '../views/cart.ejs');
    res.render(viewCart, { cart: req.session.cart || [], user: req.session.user });
});

// xử lý thêm vào giỏ hàng
router.post('/add-to-cart', async (req, res) => {
    const { productId, quantity } = req.body;

    // Nếu productId và quantity không được gửi lên, chỉ hiển thị trang giỏ hàng
    if (!productId || !quantity) {
        const viewCart = path.join(__dirname, '../views/cart.ejs');
        res.render(viewCart, { cart: req.session.cart || [] });
        return;
    }

    // Khởi tạo giỏ hàng nếu chưa tồn tại
    if (!req.session.cart) {
        req.session.cart = [];
    }

    // Lấy thông tin sản phẩm từ cơ sở dữ liệu
    const product = await productController.getProduct(productId);

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingProduct = req.session.cart.find(item => item.product.id == productId);

    if (existingProduct) {
        // Cập nhật số lượng nếu sản phẩm đã có trong giỏ hàng
        existingProduct.quantity += parseInt(quantity, 10);
    } else {
        // Thêm sản phẩm mới vào giỏ hàng
        req.session.cart.push({
            product,
            quantity: parseInt(quantity, 10),
        });
    }

    res.redirect('/cart');
});

// Router để xử lý yêu cầu DELETE để xoá sản phẩm khỏi giỏ hàng
router.post('/remove-from-cart', async (req, res) => {
    const { productId } = req.body;
    if (productId) {
        try {
            // Tìm sản phẩm trong giỏ hàng và xoá nó
            if (req.session.cart) {
                req.session.cart = req.session.cart.filter(item => item.product._id !== productId);
            }
            res.redirect('/cart'); // Chuyển hướng sau khi xoá thành công
        } catch (error) {
            console.error('Error:', error);
            res.sendStatus(500); // Trả về lỗi Server nếu có lỗi xảy ra
        }
    } else {
        res.status(400).send('Product ID is missing');
    }
});
//Tăng số lượng sản phẩm trong giỏ hàng
router.post('/update-cart', async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        // Xác định vị trí của sản phẩm trong giỏ hàng
        const index = req.session.cart.findIndex(item => item.product._id === productId);

        // Nếu sản phẩm tồn tại trong giỏ hàng, cập nhật số lượng
        if (index !== -1) {
            req.session.cart[index].quantity = parseInt(quantity, 10);
        }

        // Gửi phản hồi thành công với dữ liệu giỏ hàng đã được cập nhật
        // res.json({ success: true, cart: req.session.cart });
        res.redirect('back')
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Trang check out
router.get('/checkout', async (req, res) => {
    const checkoutView = path.join(__dirname, '../views/checkout.ejs');
    //const products = await productController.getlistProduct();
    res.render(checkoutView ,{ cart: req.session.cart || [], user: req.session.user });
});


router.get('/admin/order', async (req, res) => {
    const orderView = path.join(__dirname, '../views/order-manage.ejs');
    const orders = await orderController.getListOrder();
    res.render(orderView, { data: orders, user: req.session.user });
});


module.exports = router;
