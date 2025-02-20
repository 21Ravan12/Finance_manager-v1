const express = require('express');
const { financialPlansRegister, financialPlansUpdate, getFinancialPlansData } = require('../controllers/financialPlansController');

const router = express.Router();


router.post('/financial_plans_register', financialPlansRegister);
router.post('/financial_plans_update', financialPlansUpdate);
router.get('/financial_plans_get/:token', getFinancialPlansData);


module.exports = router;