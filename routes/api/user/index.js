const express = require('express');
const route = express.Router();

const userRoute = require('./user');
const productRoute = require('./product');

route.use('/userCreate', userRoute);
route.use('/productCompare', productRoute);

module.exports = route;