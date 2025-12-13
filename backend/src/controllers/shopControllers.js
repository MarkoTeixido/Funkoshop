const { product } = require('../models/model_product');
const { category } = require('../models/model_category');
const { licence } = require('../models/model_licence');
const { Op } = require('sequelize');
const Cart = require('../models/model_cart');
const CartItem = require('../models/model_cart_item');
const Order = require('../models/model_order');
const OrderItem = require('../models/model_order_item');
const User = require('../models/model_user');
const { sequelize } = require('../config/conn');

const shopControllers = {
  shopView: async (req, res) => {
    try {
      const { search, min, max, sort, offers, special } = req.query;
      const isNew = req.query.new; // 'new' is a reserved word in some contexts
      const whereClause = { is_active: true };

      if (search) {
        whereClause[Op.or] = [
          { product_name: { [Op.like]: `%${search}%` } },
          { '$Category.category_name$': { [Op.like]: `%${search}%` } },
          { '$Licence.licence_name$': { [Op.like]: `%${search}%` } }
        ];
      }

      if (min || max) {
        whereClause.price = {};
        if (min) whereClause.price[Op.gte] = min;
        if (max) whereClause.price[Op.lte] = max;
      }

      // Sidebar Filters
      if (offers === 'true') {
        whereClause.discount = { [Op.gt]: 0 };
      }

      if (special === 'true') {
        whereClause.is_featured = true;
      }

      if (isNew === 'true') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        whereClause.created_at = { [Op.gte]: thirtyDaysAgo };
      }

      let orderClause = [['created_at', 'DESC']];
      if (sort === 'price-ascending') orderClause = [['price', 'ASC']];
      if (sort === 'price-descending') orderClause = [['price', 'DESC']];
      if (sort === 'alpha-ascending') orderClause = [['product_name', 'ASC']];
      if (sort === 'alpha-descending') orderClause = [['product_name', 'DESC']];

      const collections = await product.findAll({
        where: whereClause,
        include: [
          { model: category },
          { model: licence }
        ],
        order: orderClause
      });
      res.json(collections);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },
  idView: async (req, res) => {
    try {
      const item = await product.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: 'Producto no encontrado' });
      const related = await product.findAll({
        where: { category_id: item.category_id, is_active: true },
        limit: 3
      });
      res.json({ product: item, related });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Orders Logic
  getOrders: async (req, res) => {
    try {
      const userId = req.user.id;
      const orders = await Order.findAll({
        where: { user_id: userId },
        include: [{ model: OrderItem }],
        order: [['created_at', 'DESC']]
      });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cart Logic
  getCart: async (req, res) => {
    try {
      const userId = req.user.id;
      let cart = await Cart.findOne({
        where: { user_id: userId },
        include: [{
          model: CartItem,
          include: [product]
        }]
      });

      if (!cart) {
        cart = await Cart.create({ user_id: userId });
        return res.json({ cart_id: cart.cart_id, items: [] });
      }

      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  addToCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const { product_id, quantity } = req.body;

      let cart = await Cart.findOne({ where: { user_id: userId } });
      if (!cart) {
        cart = await Cart.create({ user_id: userId });
      }

      const existingItem = await CartItem.findOne({
        where: { cart_id: cart.cart_id, product_id }
      });

      if (existingItem) {
        existingItem.quantity += parseInt(quantity);
        await existingItem.save();
      } else {
        await CartItem.create({
          cart_id: cart.cart_id,
          product_id,
          quantity
        });
      }

      res.json({ success: true, message: 'Producto agregado al carrito' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  removeItem: async (req, res) => {
    try {
      const userId = req.user.id;
      const cart = await Cart.findOne({ where: { user_id: userId } });
      if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

      await CartItem.destroy({
        where: { cart_id: cart.cart_id, product_id: req.params.id }
      });

      res.json({ success: true, message: 'Producto eliminado del carrito' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateItem: async (req, res) => {
    try {
      const { quantity } = req.body;
      const userCart = await Cart.findOne({ where: { user_id: req.user.id } });
      const item = await CartItem.findOne({
        where: { cart_id: userCart.cart_id, product_id: req.params.id }
      });

      if (item) {
        item.quantity = quantity;
        await item.save();
        res.json({ success: true });
      } else {
        res.status(404).json({ error: 'Item no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  checkout: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const userId = req.user.id;
      const cart = await Cart.findOne({
        where: { user_id: userId },
        include: [{ model: CartItem, include: [product] }]
      });

      if (!cart || cart.CartItems.length === 0) {
        return res.status(400).json({ error: 'El carrito está vacío' });
      }

      let totalAmount = 0;
      cart.CartItems.forEach(item => {
        totalAmount += parseFloat(item.Product.price) * item.quantity;
      });

      // Verify Stock
      for (const item of cart.CartItems) {
        if (item.Product.stock < item.quantity) {
          await transaction.rollback();
          return res.status(400).json({ error: `No hay suficiente stock para ${item.Product.product_name}` });
        }
      }

      const order = await Order.create({
        order_number: `ORD-${Date.now()}`,
        user_id: userId,
        total_amount: totalAmount,
        final_amount: totalAmount,
        shipping_street: req.body.street || 'Calle Falsa 123',
        shipping_city: req.body.city || 'Springfield',
        shipping_state: req.body.state || 'State',
        shipping_postal_code: req.body.zip || '12345',
        shipping_country: req.body.country || 'USA',
        shipping_phone: req.body.phone || '555-5555',
        payment_method: 'credit_card',
        status: 'processing' // Changed to processing (valid enum value)
      }, { transaction });

      for (const item of cart.CartItems) {
        // Create Order Item
        await OrderItem.create({
          order_id: order.order_id,
          product_id: item.product_id,
          product_name: item.Product.product_name,
          product_sku: item.Product.sku,
          quantity: item.quantity,
          unit_price: item.Product.price,
          subtotal: parseFloat(item.Product.price) * item.quantity
        }, { transaction });

        // Deduct Stock
        const productInstance = await product.findByPk(item.product_id, { transaction });
        productInstance.stock -= item.quantity;
        await productInstance.save({ transaction });
      }

      // Clear Cart
      await CartItem.destroy({
        where: { cart_id: cart.cart_id },
        transaction
      });

      await transaction.commit();
      res.json({ success: true, message: 'Orden creada exitosamente', orderId: order.order_number });

    } catch (error) {
      await transaction.rollback();
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = shopControllers;
