const bcrypt = require("bcrypt");
const User = require("../../models/user");

const userCreate = async (req, res) => {
  try {
    const { name, contactNumber, email, userType, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { contactNumber }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({ error: "Email already registered" });
      }
      if (existingUser.contactNumber === contactNumber) {
        return res
          .status(409)
          .json({ error: "Mobile number already registered" });
      }
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    const userRegistration = new User({
      name,
      contactNumber,
      email,
      userType:'user',
      password:hashedPassword
    });

    await userRegistration.save();

    res.status(201).render("success");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    await user.save();

    req.session.userId = user._id;
    console.log("Setting session userId:", user._id); // or admin._id

    console.log('userId', req.session.userId)


    // console.log("OTP sent to user:", otp);
    res.render("userDashboard", { userId: user._id });
  } catch (error) {
    res.status(500).send("Login Error: " + error.message);
  }
};

module.exports = { userCreate, userLogin };
