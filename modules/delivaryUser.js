const mongoose = require('mongoose')


const delivaryUserSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]
})

const delivaryUser = mongoose.model('DelivaryUser', delivaryUserSchema)

module.exports = delivaryUser