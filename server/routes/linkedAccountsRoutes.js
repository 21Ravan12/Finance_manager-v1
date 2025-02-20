const express = require('express');
const { linkedAccountsRegister, linkedAccountsUpdate, getLinkedAccountsData, linkedAccountsDelete } = require('../controllers/linkedAccountsController');

const router = express.Router();


router.post('/linked_accounts_register', linkedAccountsRegister);
router.delete('/linked_accounts_delete', linkedAccountsDelete);
router.post('/linked_accounts_update', linkedAccountsUpdate);
router.get('/linked_accounts_get/:token', getLinkedAccountsData);


module.exports = router;