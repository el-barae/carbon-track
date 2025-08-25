const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

router.get('/', userService.getAllUsers);

router.get('/:wallet', userService.getUserByWallet);

router.post('/footprint/calculate', userService.calculateFootprint);

module.exports = router;
