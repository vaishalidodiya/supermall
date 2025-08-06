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

mongoose
  .connect(url, {})
  .then(async (d) => {
    const admin = await userModel.findOne({ userType: "admin" });
    
    if (!admin) {
      const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, bcrypt.genSaltSync(10));
      
      await userModel.create({
        name: ADMIN_NAME,
        contactNumber: ADMIN_CONTACTNUMBER,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        userType: "admin",
      });
    }

    console.log("database connected successfully");
  })
  .catch((e) => {
    console.log("database not connected", e);
  });
