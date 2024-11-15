const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');

router.get('/login', userController.index);
router.get('/', userController.index);


module.exports = router;