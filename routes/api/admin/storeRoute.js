const express = require("express");
const route = express.Router();
const {
  storeList,
  storeDetails,
  storeCreate,
  storeUpdate,
  storeDelete,
} = require("../../../controllers/admin/storeController");


route.get("/",storeList);

route.get("/:id", storeDetails);

route.post("/", storeCreate);

route.patch("/:id",storeUpdate);

route.delete("/:id", storeDelete);

module.exports = route;
