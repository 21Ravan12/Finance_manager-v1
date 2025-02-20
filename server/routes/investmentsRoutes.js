const express = require('express');
const { investmentsRegister, investmentsUpdate, getinvestmentsData, investmentsDelete } = require('../controllers/investmentsController');

const router = express.Router();


router.post('/investments_register', investmentsRegister);
router.delete('/investments_delete', investmentsDelete);
router.post('/investments_update', investmentsUpdate);
router.get('/investments_get/:token', getinvestmentsData);


module.exports = router;