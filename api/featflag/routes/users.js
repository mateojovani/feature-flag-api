const express = require('express')
const router  = express.Router()

module.exports = ({ get, getUserFeatures }) => {
    /**
     * API on users
     *
     * api/users              -> a list of all users
     * api/users/:id          -> a single user by Id
     * api/users/:id/features -> A list of feature flags enabled on a user
     */
    router
    .get('/', async (req, res) => {
        try {
            const users = await get()
            if (users)
                return res.status(200).json(users)
            res.status(404).json({message: "No users found"})
        } catch(err) {
            console.log(err)
            res.status(500).json({message: "Bad request!"})
        }
    })
    .get('/:id', async (req, res) => {
        try {
            const user = await get({id: req.params.id})
            if (user)
                return res.status(200).json(user)
            res.status(404).json({message: "No user found"})
        } catch(err) {
            console.log(err)
            res.status(500).json({message: "Bad request!"})
        }
    })

    /**
     * Compile a feature set for a given user
     */
    router.get('/:id/features', async (req, res) => {
        try {
            const userFeatures = await getUserFeatures(req.params.id)
            res.status(200).json(userFeatures)
        } catch(err) {
            console.log(err)
            res.status(500).json({message: "Bad request!"})
        }
    })

    return router
}