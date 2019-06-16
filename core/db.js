const config    = require('../config')
const mongoose = require('mongoose')

//connect
mongoose.connect(`mongodb://mongo/${config.dbname}`, {useNewUrlParser: true})

//expose seed-ing
module.exports = {
    seed: (callback) => callback()
}