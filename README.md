# Feature Flag API

### Usage
Requires docker installed, to get docker:
[https://www.docker.com/get-started](https://www.docker.com/get-started)

On *Mac/Linux/Windows docker bash terminal* run:
`sh make.sh run`
Alternatively:
`docker-compose up --build`

This will get the containers and application started by exposing port `8888` on your local machine

To run unit tests:
`npm install`
`npm test`

API endpoints
```
api/features
api/features/:id
api/users
api/users/:id
api/users/:id/features
```
#
### Description
A simple feature flag API. A feature flag is, according to Wikipedia:

> A feature toggle (also feature switch, feature flag, feature flipper, conditional feature, etc.) is a technique in software development that attempts to provide an alternative to maintaining multiple source-code branches (known as feature branches), such that a feature can be tested even before it is completed and ready for release. Feature toggle is used to hide, enable or disable the feature during run time. For example, during the development process, a developer can enable the feature for testing and disable it for other users.

Source:
https://en.wikipedia.org/wiki/Feature_toggle

Feature flag will allow to conduct an A/B test. Each flag document has:

```
{
    "name": "feature_foo", # Name of the feature
    "ratio": 0.5, # Percentage of users that should get the feature (50/50 in this case)
    "enabledEmails": ["bar@baz.com"], # List of emails the feature is always enabled for, regardless of other criteria
    "includedCountries": ["US"], # List of countries the user must be from, if empty it is enabled for all countries
    "excludedCountries": ["GB"], # List of countries the user must not be from
}
```

Each user has the following information:

```
{
    "email":"foo@bar.com",
    "location":"GB"
}
```