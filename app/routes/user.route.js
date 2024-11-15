const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');

router.get('/:id/block', userController.block);
router.get('/', userController.index);


module.exports = router;