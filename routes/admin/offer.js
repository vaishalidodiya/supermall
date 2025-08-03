const express = require('express');

const route = express.Router();

route.get('/',(req,res)=>{
  res.render('offer')
})

route.get('/offer/:id/edit',(req,res)=>{

})

module.exports = route;

