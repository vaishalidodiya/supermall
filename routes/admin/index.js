const express = require('express');
const route = express.Router();

const categoryRoute = require('./category');
const offerRoute = require('./offer');

route.get('/login',(req,res)=>{
  res.render('login')
})

route.get('/dashboard',(req,res)=>{
  res.render('store')
})

route.get('/success',(req,res)=>{
  res.render('success')
})

route.use('/category',categoryRoute);
route.use('/offer', offerRoute)


module.exports = route;