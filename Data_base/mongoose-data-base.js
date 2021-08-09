const mongoose = require('mongoose')
try {
    mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-api', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })

    console.log('Connected Successfuly to Data base')
} catch (e) {
    console.log('Error Loading Data base')
}

