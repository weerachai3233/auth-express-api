const User = require("../models/user.model");
const { generateToken } = require("../utils/jwt.util");
const { hashPassword, comparePassword } = require("../utils/password.util");
const { generateUUID } = require("../utils/uuid.util");

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser = await User.create({
      user_id: generateUUID(),
      username,
      email,
      password_hash: await hashPassword(password),
    });
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken({
      user_id: user.user_id,
      username: user.username,
    });

    return res.status(200).json({
      message: "Login successful",
      user: { user_id: user.user_id, username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
};
