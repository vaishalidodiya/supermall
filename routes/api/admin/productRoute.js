const express = require('express');
const { productList, productDetails,  productCreate, productUpdate, productDelete } = require('../../../controllers/admin/productController');

const route = express.Router();

route.get("/",productList);

route.get("/:id", productDetails);

route.post("/", productCreate);

route.patch("/:id",productUpdate);

route.delete("/:id", productDelete);


module.exports = route;