const mongoose = require('mongoose')

const motivationSchema = new mongoose.Schema({

        Attribbute:{
            type: String,
            // required: true
        },
        Image: {
            type: String,
            // required: true
        
        },
        Headimg:{
            type: String,
            // required: true
        },
        content:{
            type: String,
            // required: true
        },
        bullet:{
            type: String,
        },
        isActive:{
            type: Boolean,
            default: true
        }
})

module.exports = mongoose.model('Motivation', motivationSchema)
