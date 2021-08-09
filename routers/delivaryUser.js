const express = require('express')
const User = require('../modules/user')
const DelivaryUser = require('../modules/delivaryUser')
const auth = require('../middleware/auth')
const router = new express.Router()
const Role = require('../middleware/Roles')


// DelivaryUser singning up
router.post('/delivaryUser', async (req, res) => {
    const user = new User(req.body)
    user.role = 'delivary'
    const delivaryUser = new DelivaryUser({ user: user.id })
    try {
        const token = await user.generateAuthToken()
        await user.save()
        await delivaryUser.save()
        res.header('Authorization', token).status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})


// delivaryUser logging in 
router.post('/delivaryUser/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        const delivaryUser = await DelivaryUser({ user: user })
        res.header('Authorization', token).send(delivaryUser)
    } catch (e) {
        res.status(400).send(e.toString())
    }
})

// delivaryUser logging out 
router.post('/delivaryUser/logout', auth, async (req, res, next) => {
    auth(req, res, next, [Role.Delevery])
},
    async (req, res) => {
        try {
            res.send('You are logged out successfuly')
        } catch (e) {
            res.status(500).send()
        }
    })

module.exports = router