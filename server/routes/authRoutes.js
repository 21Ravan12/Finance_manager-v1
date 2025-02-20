const express = require('express');
const { registerUser, registerUserVerifyCode, loginUser, updatePasswordSendCode, updatePasswordVerifyCode, updatePassword} = require('../controllers/authController');

const router = express.Router();


router.post('/sign_up/send_code', registerUser);
router.post('/sign_up/verify_code', registerUserVerifyCode);
router.post('/log_in', loginUser);
router.post('/resfresh_password/send_code', updatePasswordSendCode);
router.post('/resfresh_password/verify_code', updatePasswordVerifyCode);
router.post('/resfresh_password/update_password', updatePassword);


module.exports = router;
