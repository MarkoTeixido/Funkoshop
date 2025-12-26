const dashboardService = require('../services/service_dashboard');
const productService = require('../services/service_product');
const orderService = require('../services/service_order');
const categoryService = require('../services/service_category');
const licenceService = require('../services/service_licence');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { HTTP_CODES, MESSAGES } = require('../utils/constants');

const adminControllers = {
    // Dashboard: Get Products List (Original logic seemed to return products for dashboard? keeping it compatible)
    // If the original `getDashboard` returned products, we keep it. 
    // BUT the new architecture suggests `getDashboard` might be stats. 
    // Let's look at the original code: `res.json(products)`
    // So it was actually a product list for the dashboard view.
    getDashboard: asyncHandler(async (req, res) => {
        const products = await productService.getAllProducts();
        res.json(products);
    }),

    // Activity: Get Stats
    getActivity: asyncHandler(async (req, res) => {
        const stats = await dashboardService.getDashboardStats();
        res.json(stats);
    }),

    // Notifications: Low Stock
    getNotifications: asyncHandler(async (req, res) => {
        const lowStockCount = await dashboardService.getLowStockCount();
        res.json({ lowStockCount });
    }),

    // Create Product
    createProduct: asyncHandler(async (req, res) => {
        // Validation is handled by middleware before this
        const newProduct = await productService.createProduct(req.body);
        res.status(HTTP_CODES.CREATED).json({
            success: true,
            message: 'Producto creado correctamente.',
            product: newProduct
        });
    }),

    // Get All Orders
    getOrders: asyncHandler(async (req, res) => {
        const orders = await orderService.getAllOrders();
        res.json(orders);
    }),

    // Update Order Status
    updateOrderStatus: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;

        // Basic validation could go here or in middleware
        const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled'];
        if (!status || !validStatuses.includes(status)) {
            throw new AppError('Estado inválido', HTTP_CODES.BAD_REQUEST);
        }

        await orderService.updateStatus(id, status);
        res.json({ success: true, message: 'Estado del pedido actualizado' });
    }),

    // Delete Order
    deleteOrder: asyncHandler(async (req, res) => {
        const { id } = req.params;
        await orderService.deleteOrder(id);
        res.json({ success: true, message: 'Pedido eliminado correctamente' });
    }),

    // Reports: Downloadable Data
    getReports: asyncHandler(async (req, res) => {
        const { period } = req.query;
        const orders = await orderService.getOrdersForReport(period);
        res.json(orders);
    }),

    // Get Product By ID
    getProductById: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const product = await productService.getProductById(id);

        if (!product) {
            throw new AppError(MESSAGES.NOT_FOUND, HTTP_CODES.NOT_FOUND);
        }
        res.json(product);
    }),

    // Edit Product
    editProduct: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const success = await productService.updateProduct(id, req.body);

        if (!success) {
            throw new AppError('Producto no encontrado o no modificado', HTTP_CODES.NOT_FOUND);
        }

        res.json({ success: true, message: 'Producto actualizado' });
    }),

    // Delete Product
    deleteProduct: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const success = await productService.deleteProduct(id);

        if (!success) {
            throw new AppError(MESSAGES.NOT_FOUND, HTTP_CODES.NOT_FOUND);
        }

        res.json({ success: true, message: 'Producto eliminado' });
    }),

    // Get Categories
    getCategories: asyncHandler(async (req, res) => {
        const categories = await categoryService.getAllCategory();
        res.json(categories);
    }),

    // Get Licences
    getLicences: asyncHandler(async (req, res) => {
        const licences = await licenceService.getAllLicence();
        res.json(licences);
    })
};

module.exports = adminControllers;
