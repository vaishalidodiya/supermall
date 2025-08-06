const express = require('express');
const { userCreate, userLogin } = require('../../../controllers/user/userRegistration');
const { userStoreList } = require('../../../controllers/user/storeList');
const isAuthenticated = require('../../../middelware/auth');
const route = express.Router();

route.get('/',isAuthenticated,userStoreList)
route.post('/',userCreate);
route.post('/login',userLogin);

module.exports = route;




