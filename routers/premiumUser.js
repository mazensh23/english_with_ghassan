const express = require('express')
const router = new express.Router()
const User = require('../modules/user')
const PremiumUser = require('../modules/premiumUser')
const auth = require('../middleware/auth')

// premiumUser singning up
router.post('/premiumUser', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.id })
        user.role = 'seller'
        const premiumUser = new PremiumUser({ user: user.id, addresses: req.body.addresses, contactNumbers: req.body.contactNumbers })
        await premiumUser.save()
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Make or update discount
router.post('/discount/:id', auth, async (req, res) => {
    try {
        const product = Product.find({ owner: req.params.id })
        product.discount = req.body.discount
        await product.save()
        res.status(201).send(product)
    }
    catch (e) {
        res.status(500).send()
    }

})

module.exports = router