const mongoose = require('mongoose')


const ordersSchema = new mongoose.Schema({
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    }],
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date
    },
    address: {
        type: String,
        required: true
    },
    beingDelivered: {
        type: Boolean,
        default: false,
    },

    isDelivered: {
        type: Boolean,
        default: false,
    }
})

const Orderse = mongoose.model('Orderse', ordersSchema)

module.exports = Orderse