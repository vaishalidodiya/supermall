const express = require("express");
const route = express.Router();
const {
  storeList,
  storeDetails,
  storeCreate,
  storeUpdate,
  storeDelete,
} = require("../../../controllers/admin/storeController");
const isAuthenticated = require("../../../middelware/auth");
const { verifyToken } = require("../../../middelware/authtoken");


route.get("/",verifyToken, storeList);
route.get("/:id",verifyToken,storeDetails);
route.post("/", verifyToken, storeCreate);
route.patch("/:id",verifyToken, storeUpdate);
route.delete("/:id",verifyToken, storeDelete);

module.exports = route;





