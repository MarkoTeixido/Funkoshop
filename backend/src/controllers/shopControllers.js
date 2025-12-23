const shopService = require('../services/service_shop');
const productService = require('../services/service_product');
const orderService = require('../services/service_order');
const cartService = require('../services/service_cart');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { HTTP_CODES, MESSAGES } = require('../utils/constants');

const shopControllers = {
  // Shop View (Filtering/Search)
  shopView: asyncHandler(async (req, res) => {
    const collections = await shopService.getShopProducts(req.query);
    res.json(collections);
  }),

  // Product Details
  idView: asyncHandler(async (req, res) => {
    const item = await productService.getProductById(req.params.id);
    if (!item) throw new AppError(MESSAGES.NOT_FOUND, HTTP_CODES.NOT_FOUND);

    const related = await productService.getRelatedProducts(item.product_id, item.category_id);

    res.json({ product: item, related });
  }),

  // User Orders
  getOrders: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const orders = await orderService.getUserOrders(userId);
    res.json(orders);
  }),

  // Cart: Get
  getCart: asyncHandler(async (req, res) => {
    const cart = await cartService.getCart(req.user.id);
    res.json(cart);
  }),

  // Cart: Add
  addToCart: asyncHandler(async (req, res) => {
    console.log('🛒 [addToCart Controller] Request received');
    console.log('  User ID:', req.user?.id);
    console.log('  Body:', req.body);
    const { product_id, quantity } = req.body;
    await cartService.addToCart(req.user.id, product_id, quantity);
    console.log('  ✅ Product added successfully');
    res.json({ success: true, message: 'Producto agregado al carrito' });
  }),

  // Cart: Remove
  removeItem: asyncHandler(async (req, res) => {
    await cartService.removeItem(req.user.id, req.params.id);
    res.json({ success: true, message: 'Producto eliminado del carrito' });
  }),

  // Cart: Update Quantity
  updateItem: asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    await cartService.updateItem(req.user.id, req.params.id, quantity);
    res.json({ success: true });
  }),

  // Checkout
  checkout: asyncHandler(async (req, res) => {
    const orderId = await cartService.checkout(req.user.id, req.body);
    res.json({ success: true, message: 'Orden creada exitosamente', orderId });
  })
};

module.exports = shopControllers;
