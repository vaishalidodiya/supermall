  const express = require('express');

  const route = express.Router();

  const apiRoute = require('./api');
  const adminRoute = require('./admin');
  const userRoute = require('./user')
  

  route.use('/api', apiRoute);
  route.use('/admin', adminRoute);
  route.use('/user',userRoute);
 



  module.exports = route;



