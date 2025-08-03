const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    offerName : {type:String, required:true},
    description : {type:String},
    discount : {type:String, required:true},
    startDate : {type:String, required:true},
    endDate: {type:String, required:true},
    
}, {
    timestamps:true
})

const Offer = mongoose.model('offer', offerSchema);

module.exports = Offer;