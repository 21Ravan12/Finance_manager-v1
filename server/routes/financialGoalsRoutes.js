const express = require('express');
const { financialGoalsRegister, financialGoalsUpdate, getFinancialGoalsData, financialGoalsDelete } = require('../controllers/financialGoalsController');

const router = express.Router();


router.post('/financial_goals_register', financialGoalsRegister);
router.delete('/financial_goals_delete', financialGoalsDelete);
router.post('/financial_goals_update', financialGoalsUpdate);
router.get('/financial_goals_get/:token', getFinancialGoalsData);


module.exports = router;