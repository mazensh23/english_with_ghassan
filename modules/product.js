const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'PremiumUser'
    },

    name: {
        type: String,
        required: true,
    },

    colorsAndQuantityAndSizes: [{
        color: {
            type: Number,
            required: true
        },
        sizesAndQuantity: [{
            size: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                validate(value) {
                    if (value < 1) {
                        throw new Error('Quantity cannot be negative!')
                    }
                }
            }
        }]
    }],

    price: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Price cannot be negative!')
            }
        }
    },

    category: {
        type: String,
        required: true
    },
    type: {
        type: String
    },

    specs: [{
        type: String
    }],

    rating: {
        type: Number,
        validate(value) {
            if (value < 0 || value > 5) {
                throw new Error('rating cannot be negative!')
            }
        }
    },

    discount: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0 || value > 100) {
                throw new Error('discount cannot be negative!')
            }
        }
    },

    discription: {
        type: String
    },

    warranty_period: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('warranty_period cannot be negative!')
            }
        },
        period_type: {
            type: String,
            validate(value) {
                if(value !== 'year' || value !== 'month' || value !== 'day') {
                    throw new Error('error in type of period of warranty')
                }
            }
        }
    },

    replacement_period: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('replacement_period cannot be negative!')
            }
        },
        period_type: {
            type: String,
            validate(value) {
                if(value !== 'year' || value !== 'month' || value !== 'day') {
                    throw new Error('error in type of period of replacement')
                }
            }
        }
    },

    returning_period: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('returning_period cannot be negative!')
            }
        },
        period_type: {
            type: String,
            validate(value) {
                if(value !== 'year' || value !== 'month' || value !== 'day') {
                    throw new Error('error in type of period of returning')
                }
            }
        }
    },

    selling_counter: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('selling_counter cannot be negative!')
            }
        }
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    images: [{
        type: String
    }]

})

const Product = mongoose.model('Product', productSchema)

module.exports = Product