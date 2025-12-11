const data = require("../services/service_product");

const mainControllers = {
  defaultView: async (req, res) => {
    const collections = await data.getAllProducts();
    res.json(collections);
  },
  homeView: async (req, res) => {
    const collections = await data.getAllProducts();
    res.json(collections);
  },
  contactView: (req, res) => res.json({ message: "Contact endpoint" }),
  aboutView: (req, res) => res.send("Route for about view controller"),
  faqsView: (req, res) => res.send("Route for faqs view")
};

module.exports = mainControllers;