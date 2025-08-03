const express = require('express');
const route = express.Router();

const { categoriesAdd, categoryList, categoryDetails,categoryUpdate,categoryDelete} = require('../../../controllers/admin/categoryController');



route.get('/', categoryList);
route.get('/:id', categoryDetails)
route.post('/', categoriesAdd);
route.patch('/:id',categoryUpdate)
route.delete('/:id',categoryDelete)

module.exports = route;