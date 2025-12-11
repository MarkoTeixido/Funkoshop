const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authControllers');
const { registerValidations, loginValidations } = require('../utils/user_validations');
const { verifyToken } = require('../middlewares/auth');

router.get('/login', authControllers.loginView);
router.post('/login', loginValidations, authControllers.loginUser);
router.get('/register', authControllers.registerView);
router.post('/register', registerValidations, authControllers.registerUser);
router.post('/logout', authControllers.logoutView);
router.get('/profile', verifyToken, authControllers.getProfile);
router.put('/profile', verifyToken, authControllers.updateProfile);

module.exports = router;