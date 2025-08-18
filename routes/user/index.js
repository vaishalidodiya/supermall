const express = require('express');
const { isAuthenticated } = require('../../middelware/auth');
const route = express.Router();



route.get('/registration',(req,res)=>{
  res.render('registration')
})

route.get('/compareProduct',isAuthenticated,(req,res)=>{
  res.render('compareProduct')
})

route.get('/userDashboard',isAuthenticated,(req,res)=>{
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





