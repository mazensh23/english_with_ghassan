const express = require('express')
const router = new express.Router()
const jwt = require('jsonwebtoken')
const User = require('../modules/user')
const auth = require('../middleware/auth')
const Role = require('../middleware/Roles')
const nodemailer = require('nodemailer');
var randomstring = require("randomstring")

let code;
// User singning up
router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        await user.delete()
        res.status(200).send(JSON.parse('{"Status":"Done"}'))

    } catch (e) {
        res.status(400).send(e)
    }

})

//Generate code 
router.post('/Generate', async (req, res) => {
    try {
        if (req.body.email) {
            var random = randomstring.generate(7);
            code = random
            let transportar = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth:
                {
                    user: "mazen.sh1221@gmail.com",
                    pass: "Messimazen10"
                }
            });
            const msg = {
                from: 'mezoshp23@gmail.com',
                to: req.body.email,
                subject: "Your Sallaty code",
                html: '<p>Hi ' + ',<p>You can enter this code to log into Sallaty:</p>' + "\n" + code
            }
            transportar.sendMail(msg, function (err, info) {
                if (err)
                    throw err;
                console.log(info.response);
            });
            var codejson = { "Code": code };
            res.status(200).send(JSON.parse(JSON.stringify(codejson)))
        }
        else
            res.send("you don't send an email")
    }
    catch (e) {
        res.status(400).send(e)
    }

})

//confirmation
router.post('/confirmation', async (req, res) => {
    try {
        if (req.body.code && req.body.name && req.body.email && req.body.number && req.body.password) {
            if (code == req.body.code) {
                const user = new User(req.body)
                console.log(req.body)
                const token = await user.generateAuthToken()
                await user.save()
                res.header('Authorization', token).status(201).send(user).send("The code is true and the user created")
            }

            else
                res.status(400).send("False code")
        }
        else
            res.send("There's error in user information")
    } catch (e) {
        res.status(400).send(e)
    }
})

// User logging in by email
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.header('Authorization', token).send(user)
    } catch (e) {
        res.status(400).send(e.toString())
    }
})

// User logging in by number
router.post('/users/loginbynumber', async (req, res) => {
    try {
        const user = await User.findByNumber(req.body.number, req.body.password)
        const token = await user.generateAuthToken()
        res.header('Authorization', token).send(user)
    } catch (e) {
        res.status(400).send(e.toString())
    }
})

// User logging out 
router.post('/users/logout', auth, async (req, res) => {
    try {
        res.send('Ypu are logged out successfuly')
    } catch (e) {
        res.status(500).send()
    }
})

// User getting profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// User updating profile
router.patch('/users/updatingProfile', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// User delete account
router.delete('/users/deleteProfile', function (req, res) {
    auth(req, res, Role.Admin)
},
    async (req, res) => {
        try {
            await req.user.remove()
            res.send('Deleted successfuly')
        } catch (e) {
            res.status(500).send(e)
        }
    })

// Check token expiration
router.post('/users/checkAccessiblity', async (req, res) => {
    try {
        const token = req.body.token
        jwt.verify(token, 'thisismynewcourse')
        res.status(200).send(token)
    } catch (e) {
        res.status(404).send('You are not allowed to access')
    }

})


module.exports = router