const dataProduct = require("../services/service_product");
const datalicence = require("../services/service_licence");
const dataCategory = require("../services/service_category");
const { validationResult } = require("express-validator");

const adminControllers = {
    index: async (req, res) => {
        try {
            const collections = await dataProduct.getAllProducts();
            res.render('admin/admin', {
                layout: 'layouts/admin-layout',
                view: {
                    title: "Admin | Productos"
                },
                collections: collections,
            });
        } catch (error) {
            console.log(error);
        }
    },
    createView: async (req, res) => {
        try {
            const licences = await datalicence.getAllLicence();
            const categories = await dataCategory.getAllCategory();
            res.render('admin/create', {
                layout: 'layouts/admin-layout',
                view: {
                    title: "Admin | Crear producto"
                },
                licences: licences,
                categories: categories,
            });
        } catch (error) {
            console.log(error);
        }
    },
    create: async (req, res) => {
        const errors = validationResult(req);
        const licences = await datalicence.getAllLicence();
        const categories = await dataCategory.getAllCategory();

        if (!errors.isEmpty()) {
            return res.render("admin/create", {
                layout: 'layouts/admin-layout',
                view: {
                    title: "Admin | Crear Producto"
                },
                licences: licences.data,
                categories: categories.data,
                values: req.body,
                errors: errors.array(),
            });
        }

        try {
            const item = req.body;
            await dataProduct.createProduct(item);
            res.redirect('/admin/products');
        } catch (error) {
            console.log(error);
        }
    },
    updateView: async (req, res) => {
        try {
            const licences = await datalicence.getAllLicence();
            const categories = await dataCategory.getAllCategory();
            const itemId = req.params.id;
            const collections = await dataProduct.getProductById(itemId);
            res.render('admin/edit', {
                layout: 'layouts/admin-layout',
                view: {
                    title: "Admin | Editar producto"
                },
                licences: licences,
                categories: categories,
                collections: collections,
            });
        } catch (error) {
            console.log(error);
        }
    },
    update: async (req, res) => {
        const errors = validationResult(req);
        const licences = await datalicence.getAllLicence();
        const categories = await dataCategory.getAllCategory();

        if (!errors.isEmpty()) {
            return res.render("admin/edit", {
                layout: 'layouts/admin-layout',
                view: {
                    title: "Admin | Editar Producto"
                },
                licences: licences.data,
                categories: categories.data,
                values: req.body,
                errors: errors.array(),
            });
        }

        try {
            const newProductId = req.params.id;
            const newProduct = req.body;
            await dataProduct.updateProductById(newProductId, newProduct);
            res.redirect('/admin/products');
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    delete: async (req, res) => {
        const errors = validationResult(req);
        const collections = await dataProduct.getAllProducts();

        if (!errors.isEmpty()) {
            return res.render('admin/products', {
                layout: 'layouts/admin-layout',
                view: {
                    title: "Admin | Productos"
                },
                collections: collections,
                values: req.body,
                errors: errors.array(),
            });
        }

        try {
            await dataProduct.deleteProductById(req.params.id);
            console.log(req.body);
            res.redirect('/admin/products');
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
};

module.exports = adminControllers;
