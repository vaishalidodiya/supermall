const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({
    categoryName: {type:String, required:true},
    description: {type:String}
},{
    timestamps:true
})

const Category = mongoose.model('category', categoriesSchema);

module.exports = Category;