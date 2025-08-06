const express = require('express');
const { productList, productDetails,  productCreate, productUpdate, productDelete } = require('../../../controllers/admin/productController');
const isAuthenticated = require('../../../middelware/auth');
const { verifyToken } = require('../../../middelware/authtoken');

const route = express.Router();

route.get("/",verifyToken, productList);
route.get("/:id", verifyToken,productDetails);
route.post("/", verifyToken,productCreate);
route.patch("/:id",verifyToken,productUpdate);
route.delete("/:id",verifyToken,productDelete);

module.exports = route;




