const mongoose = require('mongoose')
const config = require('../config/config')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,

    },
    phone: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        default: "the_pet_Whisperer@1237896"
    },
    role: {
        type: String,
        default: 'admin'
    },
},
    { timestamps: true }
)

// code to generated jwt token 

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, config.JWT, {
        expiresIn: '7d'
    })
}

module.exports = mongoose.model('User', userSchema)