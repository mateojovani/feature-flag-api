const express = require('express')
const router  = express.Router()

module.exports = ({ get }) => {
    /**
     * API on feature flags
     *
     * api/features/    -> a list of all feature flags
     * api/features/:id -> a single feature flag by Id
     */
    router
    .get('/', async (req, res) => {
        try {
            const features = await get()
            if (features)
                return res.status(200).json(features)
            res.status(404).json({message: "No features found"})
        } catch(err) {
            res.status(500).json({message: "Bad request!"})
        }
    })
    .get('/:id', async (req, res) => {
        try {
            const feature = await get({id: req.params.id})
            if (feature)
                return res.status(200).json(feature)
            res.status(404).json({message: "No feature found"})
        } catch(err) {
            res.status(500).json({message: "Bad request!"})
        }
    })

    return router
}