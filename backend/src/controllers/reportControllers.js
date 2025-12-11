const SalesByProduct = require('../models/model_view_sales');
const OrderSummary = require('../models/model_view_orders');

const reportControllers = {
    getSalesReport: async (req, res) => {
        try {
            const data = await SalesByProduct.findAll();
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getOrderReport: async (req, res) => {
        try {
            const data = await OrderSummary.findAll();
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = reportControllers;
