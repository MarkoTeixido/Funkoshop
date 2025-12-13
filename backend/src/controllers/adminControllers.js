const { product } = require('../models/model_product');
const { category } = require('../models/model_category');
const User = require('../models/model_user');
const Order = require('../models/model_order');
const { sequelize } = require('../config/conn');

const adminControllers = {
    // Dashboard: Get Products List (Mocking CRUD for now, can be expanded)
    getDashboard: async (req, res) => {
        try {
            const products = await product.findAll({
                include: { model: category, attributes: ['category_name'] }
            });
            console.log("Admin Dashboard Products:", JSON.stringify(products[0], null, 2)); // Log first item
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Activity: Get Stats
    getActivity: async (req, res) => {
        try {
            console.log("--- Debug Activity ---");
            const pendingOrders = await Order.count({ where: { status: 'pending' } });
            const completedOrders = await Order.count({ where: { status: 'processing' } }); // using processing as "Sold" for now
            const totalUsers = await User.count({ where: { role: 'user' } });
            console.log("Stats:", { pendingOrders, completedOrders, totalUsers });

            // Get recent sales (last 5)
            const recentSales = await Order.findAll({
                limit: 5,
                order: [['created_at', 'DESC']],
                include: [{ model: User, attributes: ['name', 'lastname'] }]
            });

            res.json({
                pendingOrders,
                completedOrders,
                totalUsers,
                recentSales
            });
        } catch (error) {
            console.error("Activity Error:", error);
            res.status(500).json({ error: error.message });
        }
    },

    // Notifications: Low Stock
    getNotifications: async (req, res) => {
        try {
            const lowStockCount = await product.count({
                where: {
                    stock: { [sequelize.Sequelize.Op.lte]: 3 } // Stock <= 3
                }
            });
            res.json({ lowStockCount });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Create Product (Basic Implementation)
    createProduct: async (req, res) => {
        try {
            // In a real app, handle multipart/form-data for images here
            // For now, assume req.body contains image URLs string or placeholder
            const newProduct = await product.create({
                ...req.body,
                image_front: req.body.image_front || '/img/star-wars/baby-yoda-1.webp', // Default placeholder
                image_back: req.body.image_back || '/img/star-wars/baby-yoda-box.webp',
                category_id: req.body.category || 1,
                licence_id: req.body.licence || 1
            });
            res.status(201).json({ success: true, product: newProduct });
        } catch (error) {
            console.error("Create Product Error:", error);
            res.status(500).json({ error: error.message });
        }
    },

    // Reports: Downloadable Data
    getReports: async (req, res) => {
        try {
            const { period } = req.query; // day, week, month, year
            let dateFilter = new Date();

            if (period === 'day') dateFilter.setDate(dateFilter.getDate() - 1);
            else if (period === 'week') dateFilter.setDate(dateFilter.getDate() - 7);
            else if (period === 'month') dateFilter.setMonth(dateFilter.getMonth() - 1);
            else if (period === 'year') dateFilter.setFullYear(dateFilter.getFullYear() - 1);
            else dateFilter = new Date(0); // All time

            const orders = await Order.findAll({
                where: {
                    created_at: { [sequelize.Sequelize.Op.gte]: dateFilter }
                },
                include: [{ model: User, attributes: ['name', 'email'] }]
            });

            // In a real app, generate CSV/PDF here. For now, return JSON.
            res.json(orders);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get Product By ID
    getProductById: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await product.findByPk(id);
            if (!item) return res.status(404).json({ error: 'Producto no encontrado' });
            res.json(item);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Edit Product
    editProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const updated = await product.update({
                ...req.body,
                category_id: req.body.category || req.body.category_id,
                licence_id: req.body.licence || req.body.licence_id,
                image_front: req.body.image_front,
                image_back: req.body.image_back
            }, {
                where: { product_id: id }
            });

            if (updated[0] === 0) return res.status(404).json({ error: 'Producto no encontrado o no modificado' });

            res.json({ success: true, message: 'Producto actualizado' });
        } catch (error) {
            console.error("Edit Product Error:", error);
            res.status(500).json({ error: error.message });
        }
    },

    // Delete Product
    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await product.destroy({ where: { product_id: id } });

            if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });

            res.json({ success: true, message: 'Producto eliminado' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = adminControllers;
