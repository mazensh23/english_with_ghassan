const express = require('express')
const Product = require('../modules/product')
const auth = require('../middleware/auth')
const Orders = require('../modules/orders')
const Role = require("../middleware/Roles")
const Order = require('../modules/order')
const router = new express.Router()

// Create Orders 
router.post('/orders', auth, async (req, res) => {
    const orders = new Orders({
        ...req.body,
        buyer: req.user._id
    })
    
    orders.orders.forEach(async (order) => {
        const temporaryOrder = await Order.findOne({_id: order})
        const product = await Product.findOne({_id: temporaryOrder.product_id})

        product.colorsAndQuantityAndSizes.find( async (color) => {
            return color._id === temporaryOrder.color_id

        }).sizesAndQuantity.find( async (sizeQuantity) => {
            console.log(sizeQuantity._id)
            console.log(temporaryOrder.size_id)
             if(sizeQuantity._id === temporaryOrder.size_id){
                console.log('fat')
                sizeQuantity.quantity -= temporaryOrder.quantity
            }
        })

        await product.save()
    })

    try {
        await orders.save()
        res.status(201).send(orders)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Get Orders by id
router.get('/orders/:id', auth, async (req, res) => {

    try {
        const orders = await Orders.findOne({ _id: req.params.id })
        if (!orders) {
            return res.status(404).send()
        }

        res.send(orders)
    } catch (e) {
        res.status(500).send()
    }
})

// Get Orders by buyer id
router.get('/ordersByBuyer/:id', auth, async (req, res) => {

    try {
        const orders = await Orders.findOne({ buyer: req.params.id })
        if (!orders) {
            return res.status(404).send()
        }

        res.send(orders)
    } catch (e) {
        res.status(500).send()
    }
})

// Update Orders by id from user side
router.patch('/orders/:id',  async (req, res, next)  =>{
    auth(req, res, next, [Role.User,Role.Admin,Role.Seller])
},
    async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['orders', 'address']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const orders = await Orders.findOne({ _id: req.params.id, owner: req.user._id})

        if (!orders) {
            return res.status(404).send()
        }

        updates.forEach((update) => orders[update] = req.body[update])
        await orders.save()
        res.send(product)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Update Orders by id from delivary side 
router.patch('/ordersdelivary/:id', async (req, res, next)  =>{
    auth(req, res, next, [Role.Delevery,Role.Admin])
}, 
async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['beingDelivered','isDelivered']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const orders = await Orders.findOne({ _id: req.params.id})

        if (!orders) {
            return res.status(404).send()
        }

        updates.forEach((update) => orders[update] = req.body[update])
        await orders.save()
        res.send(orders)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Delete Orders by id 
router.delete('/orders/:id', auth, async (req, res) => {
    try {
        const orders = await Orders.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!orders) {
            res.status(404).send()
        }

        res.send(orders)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router