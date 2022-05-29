const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    email: {type:String, required:true, unique:true},
    password: {type:String, required: true},
    role:{type:String, required:true, enum: ['admin', 'user']}
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('user',userSchema )
