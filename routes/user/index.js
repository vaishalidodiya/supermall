const express = require('express');
const route = express.Router();



route.get('/userRegistration',(req,res)=>{
  res.render('userRegistration')
})

route.get('/userLogin',(req,res)=>{
  res.render('userLogin')
})

route.get('/userIndex',(req,res)=>{
  res.render('userIndex')
})

route.get('/userDashboard',(req,res)=>{
  res.render('userDashboard')
})

module.exports = route;