const mongoose = require('mongoose')


const orderSchema = new mongoose.Schema({
    orderer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'NormalUser'
    },
    
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },

    notes: {
        type: String
    },

    quantity: {
        type: Number,
        required: true
    },

    color_id: {
        type: mongoose.Schema.Types.ObjectId
    },

    size_id: {
        type: mongoose.Schema.Types.ObjectId
    },

    Date:{
        type:Date
    },
    premium_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PremiumUser'
    }
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order