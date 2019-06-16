const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: String,
    location: String
})

userSchema.statics.get = function (params) {
    if (params && params.id)
        return this.findById(params.id)

    return this.find()
}

const User = mongoose.model('User', userSchema)

module.exports = User
