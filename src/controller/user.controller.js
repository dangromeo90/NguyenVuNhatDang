const userModel = require('../model/user.model');
class userController {
    // get list users
    async getListUser(req, res){
        const users = await userModel.find();
        return users;
    }

    // add user
    async addUser(req ,res){
        const userdata = req.body;

        console.log(userdata);
        const newUser =  new userModel(userdata);
        await newUser.save();
        res.redirect('back');
    }
 // add User customer
    async addUserCus(req, res) {
        const userdata = req.body;

        // Kiểm tra nếu trường address là một mảng
        if (Array.isArray(userdata.address)) {
            // Chuyển đổi mảng thành chuỗi bằng cách nối các phần tử
            userdata.address = userdata.address.join(', ');
        }

        console.log(userdata);
        
        const newUser = new userModel(userdata);
        await newUser.save();

        // Lưu thông tin người dùng mới vào session
        req.session.user = newUser;

    res.redirect('/');
}


    // update user
    async updateUser(req ,res){
        const userID = req.params.id;
        const updateUserData = req.body;
        const updatedUser = await  userModel.findByIdAndUpdate(userID , updateUserData);
        res.redirect('back');
    }
    
    //delete user
    async deleteUser(req ,res){
        const userID = req.params.id;
        const deleteUser = await userModel.findByIdAndDelete(userID);
        res.redirect('back')
    }
    // Login
   // Login
async userLogin(username, password) {
    const user = await userModel.findOne({ username });
    if (!user) {
        return null; // Trả về null nếu người dùng không tồn tại
    }
    // So sánh mật khẩu
    const isPasswordMatch = (user.password === password);
    if (!isPasswordMatch) {
        
        return null; // Trả về null nếu mật khẩu không khớp
    }
    // Trả về thông tin người dùng nếu đăng nhập thành công
    return user;
}


}

module.exports = new userController()