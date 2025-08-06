const express = require('express');
const route = express.Router();

const categoryRoute = require('./category');
const offerRoute = require('./offer');
const storeRoute = require('./store')

route.get('/login',(req,res)=>{
  res.render('login')
})

route.get('/success',(req,res)=>{
  res.render('success')
})

route.get('/logout',(req, res) => {

  if (req.session) {
    req.session.destroy();
  }
  res.render('dashboard')
})

route.use('/category',categoryRoute);
route.use('/offer', offerRoute);
route.use('/store',storeRoute);


module.exports = route;

