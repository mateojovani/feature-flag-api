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

userSchema.statics.filterFeatures = async function (userId, features) {
    try {
        const { email, location } = await this.findById(userId)

        return features
            .filter(feature => {
                if (!feature.enabledEmails.includes(email)) { //in order of importance
                    if (feature.includedCountries.length === 0) {
                        if (feature.excludedCountries.includes(location))
                            return false
                    } else {
                        if (!feature.includedCountries.includes(location))
                            return false
                    }
                }

                return true
            })
            .map(feature => feature.name)

    } catch (err) {
        console.log(err)
        return []
    }
}

const User = mongoose.model('User', userSchema)

module.exports = User
