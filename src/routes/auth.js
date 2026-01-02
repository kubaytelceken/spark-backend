const express = require('express');
const router = express.Router();
const { register, login,googleLogin,appleLogin } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/apple', appleLogin);

module.exports = router;