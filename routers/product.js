const express = require('express')
const Product = require('../modules/product')
const auth = require('../middleware/auth')
const router = new express.Router()
const Role = require('../middleware/Roles')
const PremiumUser = require('../modules/premiumUser')
const fs = require('fs')

// Create new product 
router.post('/product', auth, async (req, res, next) => {
    auth(req, res, next, [Role.Seller])
},
    async (req, res) => {
        try {
            const product = new Product({
                ...req.body,
                owner: req.user._id
            })

            var indexCounter = 0
            product.images.forEach((image) => {
                const url = 'https://hamdi1234.herokuapp.com/'
                const path = 'products_images/' + product._id + '_' + indexCounter + '.png'
                fs.writeFileSync(path, image, { encoding: "base64" })
                product.images[indexCounter] = url + path
                indexCounter++
            })

            await product.save()
            res.status(201).send(product)
        } catch (e) {
            res.status(400).send(e)
        }
    })

// Get product by category
router.get('/product', auth, async (req, res, next) => {
    auth(req, res, next, [Role.Admin, Role.Seller])
},
    async (req, res) => {
        try {
            const products = await Product.find({ category: req.query.category })

            const filteredProducts = products.filter((product) => {
                return !product.isDeleted
            })

            res.send(filteredProducts)
        } catch (e) {
            res.status(500).send()
        }
    })

// Get product by type
router.get('/getProductByType', auth, async (req, res) => {

    try {
        const products = await Product.find({ type: req.query.type })

        const filteredProducts = products.filter((product) => {
            return !product.isDeleted
        })

        res.send(filteredProducts)
    } catch (e) {
        res.status(500).send()
    }
})

// Get product by id
router.get('/product/:id', auth, async (req, res) => {

    try {

        const product = await Product.findOne({ _id: req.params.id })

        if (!product || product.isDeleted) {
            return res.status(404).send()
        }

        res.send(product)
    } catch (e) {
        res.status(500).send()
    }
})

// Get product by owner 
router.get('/productowner/:id', auth, async (req, res, next) => {
    const products = await Product.find({ owner: req.params.id })

    const filteredProducts = products.filter((product) => {
        return !product.isDeleted
    })
    res.send(filteredProducts)
})

// Update product by id
router.patch('/product/:id', auth, async (req, res, next) => {
    auth(req, res, next, [Role.Admin, Role.Seller])
},
    async (req, res) => {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'colorsAndQuantityAndSizes', 'price', 'category', 'type', 'discount', 'discription']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' })
        }
        try {

            const product = await Product.findOne({ _id: req.params.id })

            if (!product || product.isDeleted) {
                return res.status(404).send()
            }

            updates.forEach((update) => product[update] = req.body[update])
            await product.save()
            res.send(product)
        } catch (e) {
            res.status(400).send(e)
        }
    })

// Get product's images    
router.get('/product/:id/images', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product || !product.images) {
            throw new Error()
        }

        res.send(product.images)

    } catch (e) {
        res.status(404).send()
    }
})

// Update product's images
router.patch('/product/:id/images', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        const newImages = req.body.images
        var indexCounter = 0
        newImages.forEach((image) => {
            const url = 'https://hamdi1234.herokuapp.com/'
            const path = 'products_images/' + product._id + '_' + indexCounter + '.png'
            fs.writeFileSync(path, image, { encoding: "base64" })
            product.images[indexCounter] = url + path
            indexCounter++
        })

        if (!product || !product.images) {
            throw new Error()
        }

        await product.save()
        res.send(product)
    } catch (e) {
        res.status(404).send()
    }
})

// Delete product by id
router.delete('/product/:id', auth, async (req, res, next) => {
    auth(req, res, next, [Role.Admin, Role.Seller])
},
    async (req, res) => {
        try {
            const product = await Product.findOne({ _id: req.params.id })

            if (!product) {
                res.status(404).send()
            }
            product.isDeleted = true
            await product.save()
            res.send(product)
        } catch (e) {
            res.status(500).send()
        }
    })


// Make a cobone
router.patch('/productDiscount/:id', async (req, res, next) => {
    auth(req, res, next, [Role.Admin, Role.Seller])
},
    async (req, res) => {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['discount']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' })
        }
        try {

            const product = await Product.findOne({ owner: req.params.id })
            if (!product) {
                return res.status(404).send()
            }

            updates.forEach((update) => product[update] = req.body[update])
            BeforeDiscount = product.priceBeforeDiscount
            product.priceAfterDiscount = BeforeDiscount - (BeforeDiscount * (req.body.discount) / 100)
            await product.save()
            res.send(product)
        } catch (e) {
            res.status(400).send(e)
        }
    })


module.exports = router