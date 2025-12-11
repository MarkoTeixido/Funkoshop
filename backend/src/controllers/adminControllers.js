const dataProduct = require("../services/service_product");
const datalicence = require("../services/service_licence");
const dataCategory = require("../services/service_category");
const { validationResult } = require("express-validator");

const adminControllers = {
    index: async (req, res) => {
        try {
            const collections = await dataProduct.getAllProducts();
            res.json(collections);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    },
    create: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const item = req.body;
            const newProduct = await dataProduct.createProduct(item);
            res.status(201).json(newProduct);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    },
    update: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newProductId = req.params.id;
            const newProduct = req.body;
            const updated = await dataProduct.updateProductById(newProductId, newProduct);
            res.json(updated);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            await dataProduct.deleteProductById(req.params.id);
            res.json({ success: true, message: "Producto eliminado" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = adminControllers;
