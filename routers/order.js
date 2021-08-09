const express = require('express')
const Order = require('../modules/order')
const auth = require('../middleware/auth')
const router = new express.Router()
const Role = require('../middleware/Roles')
const PremiumUser = require('../modules/premiumUser')
const Product = require('../modules/product')


// Create Order
router.post('/order', async (req, res, next) => {
    auth(req, res, next, [Role.Seller, Role.normal])
},
    async (req, res) => {
        const order = new Order({
            ...req.body,
            orderer: req.user._id
        })
        const product = await Product.findOne({ _id: req.body.product_id })
        const premiumUser = await PremiumUser.findOne({ _id: product.owner })
        order.premium_id = premiumUser._id
        try {
            await order.save()
            res.status(201).send(order)
        } catch (e) {
            res.status(400).send(e)
        }
    })

// Get Order by orderer
router.get('/order', auth, async (req, res) => {
    try {
        const order = await Order.find({ orderer: req.user._id })
        res.send(order)
    } catch (e) {
        res.status(500).send()
    }
})

// Get Order by id
router.get('/order/:id', auth, async (req, res) => {

    try {
        const order = await Order.findOne({ _id: req.params.id })
        if (!order) {
            return res.status(404).send()
        }

        res.send(order)
    } catch (e) {
        res.status(500).send()
    }
})

// Get Order by seller 
router.get('/getRecentlyOrders/:id', async (req, res, next) => {
    auth(req, res, next, [Role.Seller, Role.admin])
},
    async (req, res, next) => {
        try{
        const order = await Order.find({ premium_id: req.params.id })
        res.send(order)
        }catch(e){
            res.status(400).send(e)
        }
    })

// Update Order by id
router.patch('/order/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['quantity', 'notes']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {

        const order = await Order.findOne({ _id: req.params.id })
        if (!order) {
            return res.status(404).send()
        }

        updates.forEach((update) => order[update] = req.body[update])
        await order.save()
        res.send(order)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Delete order by id
router.delete('/order/:id', auth, async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!order) {
            res.status(404).send()
        }

        res.send(order)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router