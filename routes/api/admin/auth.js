const express = require('express');
const { login } = require('../../../controllers/admin/auth');

const route = express.Router();

route.post("/",login)

module.exports = route