const mongoose = require('mongoose')


const VideosSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    min_type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
})

const Videos = mongoose.model('Videos', VideosSchema)

module.exports = Videos