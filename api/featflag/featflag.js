/**
 * Get a given user feature flags
 * @param {object} user {email, location}
 * @param {Array} features features records
 *
 * @returns {Array} feature names
 */
const filterFeatures = (user, features) => {
    const { email, location } = user

    return features
        .filter(feature => { //in order of importance
            if (!feature.enabledEmails.includes(email)) {
                if (!feature.ratioFilled) {
                    if (feature.includedCountries.length === 0) {
                        if (feature.excludedCountries.includes(location))
                            return false //location excluded

                        return true //all locations
                    } else {
                        if (!feature.includedCountries.includes(location))
                            return false //location not included

                        return true //location included
                    }
                }

                return false //ratio filled
            }

            return true //email is included
        })
        .map(feature => feature.name)
}

module.exports = {
    filterFeatures
}