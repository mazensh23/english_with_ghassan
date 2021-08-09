const express = require('express')
const User = require('../modules/user')
const AdminUser = require('../modules/adminUser')
const auth = require('../middleware/auth')
const router = new express.Router()
const Role = require('../middleware/Roles')


// AdminUser singning up
router.post('/adminUser', async (req, res) => {

    const user = new User(req.body)
    user.role = 'admin'
    const adminUser = new AdminUser(req.body)
    try {
        const token = await user.generateAuthToken()
        await user.save()
        await adminUser.save()
        res.header('Authorization', token).status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// AdminUser logging in by email
router.post('/adminUser/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        const adminUser = await adminUser({ user: user })
        res.header('Authorization', token).send(adminUser)
    } catch (e) {
        res.status(400).send(e.toString())
    }
})

// AdminUser logging in by number
router.post('/adminUser/login', async (req, res) => {
    try {
        const user = await User.findByNumber(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        const adminUser = await adminUser({ user: user })
        res.header('Authorization', token).send(adminUser)
    } catch (e) {
        res.status(400).send(e.toString())
    }
})

// AdminUser logging out 
router.post('/adminUser/logout', auth, async (req, res) => {
    try {
        res.send('You are logged out successfuly')
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router