const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/adminControllers');
const { verifyToken, isAdmin } = require('../middlewares/auth');
const { productValidations } = require('../utils/product_validation');

router.get('/products', verifyToken, isAdmin, adminControllers.index);
router.post('/products/create', verifyToken, isAdmin, productValidations, adminControllers.create);
router.put('/products/edit/:id', verifyToken, isAdmin, productValidations, adminControllers.update);
router.delete('/products/delete/:id', verifyToken, isAdmin, adminControllers.delete);

const reportControllers = require('../controllers/reportControllers');

router.get('/reports/sales', verifyToken, isAdmin, reportControllers.getSalesReport);
router.get('/reports/orders', verifyToken, isAdmin, reportControllers.getOrderReport);

module.exports = router;