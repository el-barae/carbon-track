const express = require('express');
const router = express.Router();
const creditService = require('../services/creditService');

router.get('/', creditService.getAllCredits);

router.post('/', creditService.createCredit);

module.exports = router;
