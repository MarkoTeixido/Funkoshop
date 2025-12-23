const authService = require('../services/service_auth');
const userService = require('../services/service_user');
const asyncHandler = require('../utils/asyncHandler');
const { HTTP_CODES, ROLES } = require('../utils/constants');

const authControllers = {
  loginView: (req, res) => res.json({ message: "Login endpoint" }),

  loginUser: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const authData = await authService.login(email, password, ROLES.USER);

    res.json({
      success: true,
      message: 'Login exitoso',
      token: authData.accessToken,  // Frontend expects 'token' not 'accessToken'
      refreshToken: authData.refreshToken,
      user: authData.user
    });
  }),

  loginAdmin: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const authData = await authService.login(email, password, ROLES.ADMIN);

    res.json({
      success: true,
      message: 'Admin Login exitoso',
      token: authData.accessToken,  // Frontend expects 'token' not 'accessToken'
      refreshToken: authData.refreshToken,
      user: authData.user
    });
  }),

  registerUser: asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.body);
    res.status(HTTP_CODES.CREATED).json({
      success: true,
      message: "Usuario creado exitosamente",
      user: { id: user.id, email: user.email }
    });
  }),

  logoutView: asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    req.session = null;
    res.json({ success: true, message: "Logged out" });
  }),

  getProfile: asyncHandler(async (req, res) => {
    const user = await userService.getUserProfile(req.user.id);
    res.json(user);
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const updatedUser = await userService.updateProfile(req.user.id, req.body);
    res.json({
      success: true,
      message: "Perfil actualizado",
      user: updatedUser
    });
  })
};

module.exports = authControllers;