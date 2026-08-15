const {
  registerUser,
  loginUser
} = require("../services/authService");

const generateToken = require("../utils/generateToken");

const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role
    } = req.body;

    const user = await registerUser({
      name,
      email,
      password,
      phone,
      role
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body;

    const user = await loginUser(email, password);

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(401);
    next(error);
  }
};

const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
};

module.exports = {
  register,
  login,
  getMe
};