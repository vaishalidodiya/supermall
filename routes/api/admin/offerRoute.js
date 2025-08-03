const express = require('express');
const route = express.Router();
const {offerList, offerDetails, offerAdd, offerUpdate, offerDelete } = require('../../../controllers/admin/offerController');


route.get('/', offerList);
route.get('/:id', offerDetails)
route.post('/', offerAdd);
route.patch('/:id',offerUpdate)
route.delete('/:id',offerDelete)
module.exports = route;