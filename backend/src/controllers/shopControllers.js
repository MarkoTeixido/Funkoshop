const data = require("../services/service_product");

const shopControllers = {
  shopView: async (req, res) => {
    const collections = await data.getAllProducts();
    res.json(collections);
  },
  idView: async (req, res) => {
    const collections = await data.getAllProducts();
    const id = req.params.id;
    const productById = await data.getProductById(id);
    console.log(productById);
    res.json({ product: productById, related: collections });
  },
  itemView: async (req, res, id) => { },
  cartView: (req, res) => res.json({ message: "Cart endpoint" }),
  checkoutView: (req, res) => res.render("Route for go to checkout page"),
};

module.exports = shopControllers;
