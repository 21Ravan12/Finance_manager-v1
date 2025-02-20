const express = require('express');
const { financialTipsRegister, financialTipsUpdate, getfinancialTipsData } = require('../controllers/financialTipsController');

const router = express.Router();


router.post('/financial_tips_register', financialTipsRegister);
router.post('/financial_tips_update', financialTipsUpdate);
router.get('/financial_tips_get/:token', getfinancialTipsData);


module.exports = router;