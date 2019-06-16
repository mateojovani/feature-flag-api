const mongoose = require('mongoose')

const featureSchema = new mongoose.Schema({
    name: String,
    ratio: {
        type: Number,
        min: 0,
        max: 1
    },
    ratioFilled: Boolean,
    enabledEmails: [String],
    includedCountries: [String],
    excludedCountries: [String]
})

featureSchema.statics.get = function (params) {
    if (params && params.id)
        return this.findById(params.id)

    return this.find()
}

const Feature = mongoose.model('Feature', featureSchema)

module.exports = Feature