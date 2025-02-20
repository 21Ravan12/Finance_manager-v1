const express = require('express');
const { upcomingBillsRegister, upcomingBillsUpdate, getUpcomingBillsData, upcomingBillsDelete } = require('../controllers/billsController');

const router = express.Router();


router.post('/upcoming_bills_register', upcomingBillsRegister);
router.delete('/upcoming_bills_delete', upcomingBillsDelete);
router.post('/upcoming_bills_update', upcomingBillsUpdate);
router.get('/upcoming_bills_get/:token', getUpcomingBillsData);


module.exports = router;