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

userSchema.pre("save",async function(next){
    try{
        if(this.isModified("password")){
            this.password = await bcrypt.hash(this.password, 10)
        }
        next()
    }catch(error){
        next(error);
    }
})

const User = mongoose.model('user', userSchema);

module.exports = User;