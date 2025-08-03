const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    storeName : {type:String, required:true},
    address : {type:String, required:true},
    floor : {type:String, required:true},
    contactNumber : {type:Number, required:true},
    description : {type:String}
}, {
    timestamps:true
})

const Store = mongoose.model('stores', storeSchema);

module.exports = Store