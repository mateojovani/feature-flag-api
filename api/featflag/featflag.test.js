const { filterFeatures } = require('./featflag')
const mockUsers         = require('../../seed/example_users')
let mockFeatures        = require('../../seed/features')

describe("Features Flags on user", () => {
    beforeAll(() => {
        mockFeatures = mockFeatures.map(f => {
            return {...f, ratioFilled: f.ratio == 0? true: false}
        })
    })

    test('Case ed@zzish.com', () => {
        expect(filterFeatures(mockUsers[0], mockFeatures)).toStrictEqual([
            "SuperCoolFeature",
            "SimplifiedNavBar"
        ])
    })

    test('Case vikash@zzish.com', () => {
        expect(filterFeatures(mockUsers[1], mockFeatures)).toStrictEqual(["EnhancedDashboardFeature"])
    })

    test('Case bens@zzish.com', () => {
        expect(filterFeatures(mockUsers[2], mockFeatures)).toStrictEqual([
            "MarketingBanner",
            "EnhancedDashboardFeature",
            "NewUserOnboardingJourney"
        ])
    })

    test('Filled Ratio feature', () => {
        const user = {"email": "mateojovani@gmail.com", "location": "AL"}
        const features = [
            {
                "name": "MarketingBanner",
                "ratioFilled": true,
                "ratio": 0,
                "enabledEmails": [],
                "includedCountries": ["AL"],
                "excludedCountries": []
            }
        ]

        expect(filterFeatures(user, features)).toStrictEqual([])
    })

    test('Email overrides other params', () => {
        const user = {"email": "mateojovani@gmail.com", "location": "AL"}
        const features = [
            {
                "name": "MarketingBanner",
                "ratio": 0,
                "ratioFilled": true,
                "enabledEmails": ["mateojovani@gmail.com"],
                "includedCountries": [],
                "excludedCountries": ["AL"]
            }
        ]

        expect(filterFeatures(user, features)).toStrictEqual(["MarketingBanner"])
    })
})
