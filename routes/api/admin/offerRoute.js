const express = require('express');
const route = express.Router();
const {offerList, offerDetails, offerAdd, offerUpdate, offerDelete } = require('../../../controllers/admin/offerController');
const { verifyToken } = require('../../../middelware/authtoken');


route.get('/', verifyToken,offerList);
route.get('/:id',verifyToken, offerDetails)
route.post('/', verifyToken,offerAdd);
route.patch('/:id',verifyToken,offerUpdate)
route.delete('/:id',verifyToken,offerDelete)
module.exports = route;