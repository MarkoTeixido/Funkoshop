const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/adminControllers');
const { verifyToken, isAdmin } = require('../middlewares/auth'); // assuming verifyToken/isAdmin are separate now or I need to check
const validateRequest = require('../middlewares/validationMiddleware');
const { body } = require('express-validator');

// Auth Middleware Chain
const authChain = [verifyToken, isAdmin];

// Validation Chains
const productValidation = [
    body('product_name').notEmpty().withMessage('El nombre es obligatorio'),
    body('price').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
    body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un entero positivo'),
    body('sku').notEmpty().withMessage('El SKU es obligatorio'),
    // Add more fields as needed
    validateRequest
];

// Routes
router.get('/dashboard', authChain, adminControllers.getDashboard);
router.get('/activity', authChain, adminControllers.getActivity);
router.get('/notifications', authChain, adminControllers.getNotifications);
router.get('/reports', authChain, adminControllers.getReports);
router.get('/orders', authChain, adminControllers.getOrders);
router.put('/orders/:id/status', authChain, adminControllers.updateOrderStatus);
router.delete('/orders/:id', authChain, adminControllers.deleteOrder);
router.get('/categories', authChain, adminControllers.getCategories);
router.get('/licences', authChain, adminControllers.getLicences);

router.post('/products', authChain, productValidation, adminControllers.createProduct);
router.get('/products/:id', authChain, adminControllers.getProductById);
router.put('/products/:id', authChain, productValidation, adminControllers.editProduct);
router.delete('/products/:id', authChain, adminControllers.deleteProduct);

module.exports = router;