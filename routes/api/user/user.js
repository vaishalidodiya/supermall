const express = require('express');
const { userCreate, userLogin } = require('../../../controllers/user/userRegistration');
const { userStoreList } = require('../../../controllers/user/storeList');
const route = express.Router();






route.get('/',userStoreList)
route.post('/', userCreate);
route.post('/login', userLogin);

module.exports = route;