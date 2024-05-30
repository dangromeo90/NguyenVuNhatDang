const express = require('express');
const router = express.Router();
const roleController = require('../../controller/role.controller');

// get list role
router.get('/list-role', roleController.getlistRole)
// add role
router.post('/add-role', roleController.addRole)

module.exports = router ;
