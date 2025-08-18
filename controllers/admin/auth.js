require("dotenv").config();
const bcrypt = require('bcrypt')
const User = require("../../models/user");
const { sendResponse, createToken } = require("../../helper");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email: email, userType: "admin" },{},{lean:true});
    if (!admin) {
      return sendResponse(res, 401, "User not found");
    }
    
    const isMatch = bcrypt.compareSync(password, admin.password)
    if (!isMatch) {
      return sendResponse(res, 401, "Invalid email or password");
    }

    req.session.userId = admin._id;
    req.session.email = admin.email;

    const token = createToken({ email, id: admin._id });
    sendResponse(res, 200, "Logged in successfully", { id:admin._id, token });
  } catch (error) {
    console.error("Login error:", error);
    sendResponse(res, 500, "Server error");
  }
};

module.exports = { login };
