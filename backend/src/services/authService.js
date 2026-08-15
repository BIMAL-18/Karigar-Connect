const User = require("../models/User");

const registerUser = async ({
  name,
  email,
  password,
  phone,
  role
}) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email is already registered.");
  }

  // Never allow public registration as ADMIN
  const allowedRoles = ["CUSTOMER", "PRODUCER"];

  const userRole = allowedRoles.includes(role)
    ? role
    : "CUSTOMER";

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: userRole
  });

  return user;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  if (!user.isActive) {
    throw new Error("Your account has been deactivated.");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password.");
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser
};