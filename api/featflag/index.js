/**
 * Glues together the api parts
 */
const redis             = require('async-redis')
const { filterFeatures } = require('./featflag')
const db                = require('../../core/db')
const Feature           = require('./models/feature')
const User              = require('./models/user')
/*** Seeds **/
const features          = require('../../seed/features')
const users             = require('../../seed/example_users')

const cache             = redis.createClient('6379', 'redis')
/**
 * Seed db with features/users
 */
db.seed(async () => {
    try {
        //start by cleaning collections
        await Promise.all([Feature.deleteMany({}), User.deleteMany({})])

        let promises = features
        .map(feature => {
            Feature.create({ ...feature, ratioFilled: feature.ratio == 0 ? true: false})
        })
        .concat(users.map(user => User.create(user)))

        const inserted = await Promise.all(promises)
        console.log(`Imported ${inserted.length} records into db!`)

        initCache()
    } catch(err) {
        console.log(err)
    }
})

/**
 * Async fill cache with user features
 * Needs to run on every feature update/insert
 * to re-calculate user-features
 * */
const initCache = async () => {
    const users = await User.get()
    const features = await Feature.get()
    const featuresCount = {}
    let cachePromises = []
    let dbPromises = []

    try {
        users.forEach(user => {
            const userFeatures = filterFeatures(user, features)
            const p1 = updateFeatureCount(featuresCount, userFeatures, features, users.length)
            dbPromises = dbPromises.concat(p1)

            if (userFeatures.length > 0) {
                const p2 = cache.rpush([user.id, ...userFeatures])
                cachePromises.push(p2)
            }
        })

        await Promise.all(cachePromises.concat(dbPromises))
        console.log(`${cachePromises.length} items inserted to cache!`)
    } catch (err) {
        console.log(err)
        console.log("Failed to write to cache!")
    }
}

/**
 * Update feature ratioFilled when ratio cap reached
 * @param {object} store stores each feature distribution counter
 * @param {Array} userFeatures
 * @param {Array} features
 * @param {number} totalUsers
 */
const updateFeatureCount = (store, userFeatures, features, totalUsers) => {
    let dbPromises = []
    userFeatures.forEach(featureName => {
        let feature = features.find(f => f.name === featureName)
        if (store[featureName]) {
            store[featureName]++
        } else {
            store[featureName] = 1
        }

        if (isFeatureRatioFilled(store[featureName], feature, totalUsers)) {
            feature.ratioFilled = true //update into db
            dbPromises.push(Feature.updateOne({_id: feature.id}, feature))
        }
    })

    return dbPromises
}

const isFeatureRatioFilled = (quota, feature, totalUsers) => {
    if (quota / totalUsers > feature.ratio) {
        return true
    }

    return false
}

/**
 * Provide logic to routes
 */
const featuresRouter = require('./routes/features')({
    get: (params) => Feature.get(params)
})

const usersRouter = require('./routes/users')({
    get: (params) => User.get(params),
    getUserFeatures: async (id) => {
        if (await cache.exists(id)) { //try to retrive from cache
            return await cache.lrange(id, 0, -1)
        }

        const user = await User.get({id})
        const features = await Feature.get()
        const userFeatures = filterFeatures(user, features)
        if (userFeatures.length > 0)
            cache.rpush([id, ...userFeatures])

        return userFeatures
    }
})

module.exports = {
    featuresRouter,
    usersRouter
}