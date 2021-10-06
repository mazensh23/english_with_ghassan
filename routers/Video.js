const express = require('express')
const Videos = require('../modules/Videos')
const router = new express.Router()
const fs = require('fs')

router.post('/video', async (req, res) => {
    try {
            const video = new Videos(req.body)
                const url = 'localhost:3000/'
                const path = 'Videos_images/' + video._id + '.png'
                fs.writeFileSync(path,video.image,{encoding:"base64"})
                video.image = url + path
            await video.save()
            res.status(201).send(video)
    }
    catch (e) {
        res.status(400).send(e)
             }
    })
    router.get('/cat', async (req, res) => {
            try {
                const video = await Videos.find({ category: req.body.category })
                res.send(video)
            } catch (e) {
                res.status(500).send()
            }
        })
    
module.exports = router