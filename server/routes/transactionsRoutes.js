const express = require('express');
const { transactionsRegister, transactionsUpdate, getTransactionsData } = require('../controllers/transactionsController');

const router = express.Router();


router.post('/transactions_register', transactionsRegister);
router.post('/transactions_update', transactionsUpdate);
router.get('/transactions_get/:token', getTransactionsData);


module.exports = router;