const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/adminControllers');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');

// Middleware to check for Admin Role
// Assuming verifyToken adds user to req.user
const checks = [verifyToken, (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado: Requiere rol de administrador.' });
    }
    next();
}];

router.get('/dashboard', checks, adminControllers.getDashboard);
router.post('/products', checks, adminControllers.createProduct);
router.get('/activity', checks, adminControllers.getActivity);
router.get('/notifications', checks, adminControllers.getNotifications);
router.get('/reports', checks, adminControllers.getReports);
router.get('/products/:id', checks, adminControllers.getProductById);
router.put('/products/:id', checks, adminControllers.editProduct);
router.delete('/products/:id', checks, adminControllers.deleteProduct);

module.exports = router;