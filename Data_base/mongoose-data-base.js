const mongoose = require('mongoose')
try {
    mongoose.connect('mongodb://mazen:messi.10@cluster0-shard-00-00.ybjoa.mongodb.net:27017,cluster0-shard-00-01.ybjoa.mongodb.net:27017,cluster0-shard-00-02.ybjoa.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-a5tn7x-shard-0&authSource=admin&retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })

    console.log('Connected Successfuly to Data base')
} catch (e) {
    console.log('Error Loading Data base')
}
