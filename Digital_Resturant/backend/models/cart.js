const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    allitems:[{itemtaken: {type:mongoose.Schema.Types.ObjectId, ref:"Item", required:true}, qty:Number}],
    userid:{type:mongoose.Schema.Types.ObjectId, ref:"user", required:true},
    
    totalPrice:{type:Number, default:-1}
})

module.exports = mongoose.model('cart', cartSchema)