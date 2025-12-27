const express = require('express');
const router = express.Router();
const shopControllers = require('../controllers/shopControllers');
const { verifyToken } = require('../middlewares/auth');
const validateRequest = require('../middlewares/validationMiddleware');
const { body } = require('express-validator');

// Validation Chains
const cartAddValidation = [
    body('product_id').custom((value) => {
        const num = parseInt(value);
        if (isNaN(num) || num < 1) {
            throw new Error('ID de producto inválido');
        }
        return true;
    }),
    body('quantity').custom((value) => {
        const num = parseInt(value);
        if (isNaN(num) || num < 1) {
            throw new Error('La cantidad debe ser mayor a 0');
        }
        return true;
    }),
    validateRequest
];

const checkoutValidation = [
    body('street').notEmpty(),
    body('city').notEmpty(),
    body('state').notEmpty(),
    body('zip').notEmpty(),
    body('country').notEmpty(),
    validateRequest
];

router.get('/', shopControllers.shopView);
router.get('/categories', shopControllers.getCategories);
router.get('/item/:id', shopControllers.idView);

// Protected Routes
router.use(verifyToken); // Apply to all below

router.get('/orders', shopControllers.getOrders);
router.put('/orders/:id/cancel', shopControllers.cancelOrder);

router.get('/cart', shopControllers.getCart);
router.post('/cart', cartAddValidation, shopControllers.addToCart);
router.put('/cart/:id', shopControllers.updateItem); // Could add validation for body.quantity
router.delete('/cart/:id', shopControllers.removeItem);

router.post('/checkout', checkoutValidation, shopControllers.checkout);

module.exports = router;
