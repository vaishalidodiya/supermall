const express = require('express');
const { isAuthenticated } = require('../../middelware/auth');

const route = express.Router();

route.get('/',isAuthenticated,(req,res)=>{
  res.render('store')
})

module.exports = route;


