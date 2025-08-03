const express = require('express');
const route = express.Router();

const authRoute = require('./auth');
const storeRoute = require('./storeRoute');
const categoryRoute = require('./categoryRoute');
const offerRoute = require('./offerRoute');
const productRoute = require('./productRoute');

route.use('/auth', authRoute);
route.use('/store', storeRoute);
route.use('/category', categoryRoute);
route.use('/offer', offerRoute);
route.use('/product', productRoute);


module.exports = route;
