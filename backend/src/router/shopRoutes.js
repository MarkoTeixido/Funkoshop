const express = require('express');
const router = express.Router();
const shopControllers = require('../controllers/shopControllers');

const { verifyToken } = require('../middlewares/auth');

router.get('/', shopControllers.shopView);
router.get('/item/:id', shopControllers.idView);
router.get('/orders', verifyToken, shopControllers.getOrders);
router.get('/cart', verifyToken, shopControllers.getCart);
router.post('/cart', verifyToken, shopControllers.addToCart);
router.put('/cart/:id', verifyToken, shopControllers.updateItem);
router.delete('/cart/:id', verifyToken, shopControllers.removeItem);

router.post('/checkout', verifyToken, shopControllers.checkout);

module.exports = router;
