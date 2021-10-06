require('./Data_base/mongoose-data-base')
const express = require('express')
const app = express()
const videoRouter = require('./routers/Video')
const port = process.env.PORT || 3000


app.use('/Videos_images', express.static('./Videos_images_images'))
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}))
app.use(express.json({limit: '50mb'}));
app.use(videoRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
