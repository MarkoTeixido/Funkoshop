const dataUser = require('../models/model_user');
const userService = require('../services/service_user');
const RefreshToken = require('../models/model_refresh_token');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");

const authControllers = {
  loginView: (req, res) => res.json({ message: "Login endpoint" }),
  loginUser: async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: [{ msg: "Datos inválidos" }],
        rawErrors: errors.array()
      });
    }

    try {
      const user = await dataUser.findOne({
        where: { email: req.body.email },
      });

      // Strict check: Must exist, password match, AND BE USER ROLE
      if (!user || !(await bcryptjs.compare(req.body.password, user.password)) || user.role === 'admin') {
        return res.status(401).json({
          errors: [{ msg: "Correo o contraseña incorrectos" }],
        });
      }

      // Generate Tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Save Refresh Token
      await RefreshToken.create({
        user_id: user.id,
        token: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      return res.json({
        success: true,
        message: 'Login exitoso',
        accessToken,
        refreshToken,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });

    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },
  loginAdmin: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: [{ msg: "Datos inválidos" }] });

    try {
      const user = await dataUser.findOne({ where: { email: req.body.email } });

      console.log("--- Debug Admin Login ---");
      console.log("Attempting login for:", req.body.email);
      if (user) {
        console.log("User found. Role:", user.role);
        const isMatch = await bcryptjs.compare(req.body.password, user.password);
        console.log("Password match:", isMatch);
      } else {
        console.log("User not found");
      }

      // Strict check: Must exist, match password, AND BE ADMIN ROLE
      if (!user || !(await bcryptjs.compare(req.body.password, user.password)) || user.role !== 'admin') {
        console.log("Login failed: Invalid credentials or role");
        // Fail silently / generic error
        return res.status(401).json({ errors: [{ msg: "Credenciales inválidas" }] });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      await RefreshToken.create({
        user_id: user.id,
        token: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      return res.json({
        success: true,
        message: 'Admin Login exitoso',
        accessToken,
        refreshToken,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },
  registerUser: async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    };

    try {
      const user = await userService.createUser(req.body);
      res.json({ success: true, message: "Usuario creado exitosamente", user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },
  logoutView: async (req, res) => {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await RefreshToken.destroy({ where: { token: refreshToken } });
    }
    req.session = null;
    res.json({ success: true, message: "Logged out" });
  },
  getProfile: async (req, res) => {
    try {
      // req.user is set by verifyToken middleware
      const user = await dataUser.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateProfile: async (req, res) => {
    try {
      const user = await dataUser.findByPk(req.user.id);
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

      await user.update(req.body); // Should filter body for safety
      res.json({
        success: true, message: "Perfil actualizado", user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = authControllers;