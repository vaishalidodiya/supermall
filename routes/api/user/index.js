const express = require('express');
const route = express.Router();

const userRoute = require('./user')

route.use('/userCreate', userRoute);

module.exports = route;