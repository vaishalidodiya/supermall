const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userModel = require("../models/user");
const {
  ADMIN_NAME,
  ADMIN_CONTACTNUMBER,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
} = process.env;

const url = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
console.log('url : ', url);

mongoose
  .connect(url, {})
  .then(async (d) => {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const admin = await userModel.findOne({ userType: "Admin" });

    if (!admin) {
      userModel.create({
        name: ADMIN_NAME,
        contactNumber: ADMIN_CONTACTNUMBER,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        userType: "Admin",
      });
    }

    console.log("connected");
  })
  .catch((e) => {
    console.log("not connected", e);
  });
