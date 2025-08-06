const express = require('express');
const route = express.Router();



route.get('/registration',(req,res)=>{
  res.render('registration')
})

route.get('/compareProduct',(req,res)=>{
  res.render('compareProduct')
})

route.get('/userDashboard',(req,res)=>{
  res.render('userDashboard')
})

route.get('/userLogin',(req,res)=>{
  res.render('userLogin')
})

route.get('/logout',(req, res) => {

  if (req.session) {
    req.session.destroy();
  }
  res.render('dashboard')
})

module.exports = route;





