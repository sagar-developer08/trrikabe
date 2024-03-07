const mongoose = require('mongoose')

const carouselImageSchema = new mongoose.Schema({

        name:{
            type: String,
            // required: true
        },
        carouselImages: {
            type: String,
            // required: true
        
        },
        isActive:{
            type: Boolean,
            default: true
        }
})

module.exports = mongoose.model('Carousel', carouselImageSchema)
