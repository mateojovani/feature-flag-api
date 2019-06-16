/**
 * Glues together the api parts
 */
const db       = require('../../core/db')
const Feature  = require('./models/feature')
const User     = require('./models/user')
/*** Seeds **/
const features = require('../../seed/features')
const users    = require('../../seed/example_users')

/**
 * Seed db with features/users
 */
db.seed(async () => {
    try {
        await Promise.all([
            Feature.deleteMany({}),
            User.deleteMany({})
        ]) //start by cleaning collections

        let promises = features.map(feature => Feature.create(feature))
            .concat(users.map(user => User.create(user)))
        const inserted = await Promise.all(promises)

        console.log(`Imported ${inserted.length} records into db!`)
    } catch(err) {
        console.log(err)
    }
})

/**
 * Provide logic to routes
 */

const featuresRouter = require('./routes/features')({
    get: (params) => Feature.get(params)
})

const usersRouter = require('./routes/users')({
    get: (params) => User.get(params),
    getUserFeatures: async (id) => {
        const features = await Feature.get()
        return User.filterFeatures(id, features)
    }
})

module.exports = {
    featuresRouter,
    usersRouter
}