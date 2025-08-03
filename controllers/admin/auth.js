require("dotenv").config();
const { sendResponse, createToken } = require("../../helper");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email !== adminEmail) {
      return sendResponse(res, 401, "Invalid email.");
    }

    if (password !== adminPassword) {
      return sendResponse(res, 401, "Incorrect password.");
    }

    req.session.admin = true;

    const token = createToken({ email });
    sendResponse(res, 200, "Logged in successfully", { token });
  } catch (error) {
    console.error("Login error:", error);
    sendResponse(res, 500, "Server error");
  }
};

module.exports = { login };
