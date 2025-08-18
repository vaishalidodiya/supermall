const express = require('express');
const { getAllProductsForComparison } = require('../../../controllers/user/compareUserProduct');
const { verifyToken } = require('../../../middelware/authtoken');
const route = express.Router();

route.get('/',verifyToken,getAllProductsForComparison);

module.exports = route;