const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authControllers');
const { registerValidations, loginValidations } = require('../utils/user_validations');
const { verifyToken } = require('../middlewares/auth');

// View routes removed for API-only backend
router.post('/login', loginValidations, authControllers.loginUser);
router.post('/login/admin', loginValidations, authControllers.loginAdmin);
router.post('/register', registerValidations, authControllers.registerUser);
router.post('/logout', authControllers.logoutView);
router.get('/profile', verifyToken, authControllers.getProfile);
router.put('/profile', verifyToken, authControllers.updateProfile);

module.exports = router;