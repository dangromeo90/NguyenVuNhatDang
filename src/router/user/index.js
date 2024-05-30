const express = require('express');
const router = express.Router();
const userController = require('../../controller/user.controller'); 

// list user
router.get('/list-user' , userController.getListUser );

// add user 
router.post('/add-user' , userController.addUser);
// add user 
router.post('/add-user-customer' , userController.addUserCus);

//update User
router.post('/update-user/:id', userController.updateUser);

// delete User
router.post('/delete-user/:id', userController.deleteUser);

// login 
router.post('/login', userController.userLogin);




module.exports = router;
