const dataUser = require('../models/model_user');
const userService = require('../services/service_user');
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");

const authControllers = {
  loginView: (req, res) => res.json({ message: "Login endpoint" }),
  loginUser: async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: [{ msg: "Los datos no son válidos para el acceso. Revise bien el mail y la contraseña, por favor." }],
        rawErrors: errors.array()
      });
    }

    try {
      const user = await dataUser.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (!user) {
        return res.status(401).json({
          errors: [{ msg: "El correo y/o contraseña son incorrectos (email)" }],
        });
      } else if (!(await bcryptjs.compare(req.body.password, user.password))) {
        return res.status(401).json({
          errors: [
            { msg: "El correo y/o contraseña son incorrectos (password)" },
          ],
        });
      } else {
        req.session.userId = user.id;

        return res.json({ success: true, userId: user.id });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },
  registerView: (req, res) => res.json({ message: "Register endpoint" }),
  registerUser: async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    };

    try {
      const user = await userService.createUser(req.body);

      console.log(req.body, user);
      res.json({ success: true, message: "User created", user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },
  logoutView: (req, res) => {
    req.session = null;
    res.json({ success: true, message: "Logged out" });
  },
};

module.exports = authControllers;