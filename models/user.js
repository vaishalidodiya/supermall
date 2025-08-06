const mongoose = require('mongoose');
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema({
    name: {type:String, required:true},
    contactNumber: {type:String, required:true, unique: true,},
    email: {type:String, required:true, unique: true,},
    userType:{type:String, required:true},
    password: {type:String, required:true},

},{
    timestamps:true
});





const User = mongoose.model('user', userSchema);

module.exports = User;