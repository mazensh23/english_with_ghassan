const express = require('express')
const router = new express.Router()
const User = require('../modules/user')
const NormalUser = require('../modules/normalUser')
const auth = require('../middleware/auth')

// normalUser singning up
router.post('/normalUser', async (req, res) => {

    const user = new User(req.body)
    user.role = 'normal'
    const normalUser = new NormalUser({ user: user.id, wishlist: req.body.wishlist, orders: req.body.orders })
    try {
        const token = await user.generateAuthToken()
        await user.save()
        await normalUser.save()
        res.header('Authorization', token).status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})


// get wishlist by user id 
router.get('/getWishlist/:id', auth, async (req, res) => {
    try {
        const normalUser = await NormalUser.findOne({ _id: req.params.id })

        if (!normalUser) {
            return res.status(404).send()
        }

        const wishlist = normalUser.wishlist
        res.send(wishlist)
    }
    catch (e) {
        res.status(400).send(e)
    }
})


// Update wishlist
router.patch('/updateWishlist/:id', async (req, res, next) => {
    auth(req, res, next, [Role.Admin, Role.Normal])
},
    async (req, res) => {
        try {
            const normalUser = await NormalUser.findOne({ _id: req.params.id })

            if (!normalUser) {
                return res.status(404).send()
            }
            normalUser.wishlist = req.body.wishlist
            normalUser.save()
            res.send(normalUser)
        } catch (e) {
            res.status(400).send(e)
        }

    })

// Update orders
router.patch('/updateOrders/:id', async (req, res, next) => {
    auth(req, res, next, [Role.Admin, Role.Normal])
},
    async (req, res) => {
        try {
            const normalUser = await NormalUser.findOne({ _id: req.params.id })

            if (!normalUser) {
                return res.status(404).send()
            }
            normalUser.orders = req.body.orders
            normalUser.save()
            res.send(normalUser)
        } catch (e) {
            res.status(400).send(e)
        }

    })

module.exports = router