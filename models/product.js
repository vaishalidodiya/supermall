const mongoose = require('mongoose');
 
const productSchema = new mongoose.Schema({
    productName : {type:String, required:true},
    description : {type:String, required:true},
    floor:{type:Number, required:true},
    features : {type:String, required:true},
    categoryId: {type:mongoose.Schema.Types.ObjectId, ref:'category', required:true},
    price : {type:String, required:true},
    offerId: {type:mongoose.Schema.Types.ObjectId, ref:'offer', required:true},
    storeId: {type:mongoose.Schema.Types.ObjectId, ref:'store', required:true}

},{
    timestamps:true
})

const Product = mongoose.model('product', productSchema);

module.exports = Product;