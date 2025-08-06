const express = require('express');

const route = express.Router();

route.get('/',(req,res)=>{
  res.render('store')
})

module.exports = route;


