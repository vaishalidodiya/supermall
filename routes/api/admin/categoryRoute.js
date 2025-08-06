const express = require('express');
const route = express.Router();

const { categoriesAdd, categoryList, categoryDetails,categoryUpdate,categoryDelete} = require('../../../controllers/admin/categoryController');
const { verifyToken } = require('../../../middelware/authtoken');

route.get('/',verifyToken, categoryList);
route.get('/:id',verifyToken, categoryDetails)
route.post('/',verifyToken, categoriesAdd);
route.patch('/:id',verifyToken,categoryUpdate)
route.delete('/:id',verifyToken,categoryDelete)

module.exports = route;

