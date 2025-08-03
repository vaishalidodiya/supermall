const express = require('express');

const route = express.Router();

route.get('/',(req,res)=>{
  res.render('category')
})

route.get('/:id/edit',(req,res)=>{

})

module.exports = route;

