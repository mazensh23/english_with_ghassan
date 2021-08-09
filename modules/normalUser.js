const mongoose = require('mongoose')


const normalUserSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'

    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
})

const normalUser = mongoose.model('NormalUser', normalUserSchema)

module.exports = normalUser