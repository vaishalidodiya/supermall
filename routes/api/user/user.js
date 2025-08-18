const express = require('express');
const { userCreate, userLogin } = require('../../../controllers/user/userRegistration');
const { userStoreList } = require('../../../controllers/user/storeList');
const { verifyToken } = require('../../../middelware/authtoken');
const route = express.Router();

route.get('/',verifyToken,userStoreList)
route.post('/',verifyToken,userCreate);
route.post('/login',verifyToken,userLogin);

module.exports = route;




