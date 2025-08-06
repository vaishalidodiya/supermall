const express = require('express');
const { getAllProductsForComparison } = require('../../../controllers/user/compareUserProduct');
const isAuthenticated = require('../../../middelware/auth');
const route = express.Router();

route.get('/',isAuthenticated,getAllProductsForComparison);

module.exports = route;