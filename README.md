# Feature flag test

Your task is to create a simple feature flag API. A feature flag is, according to Wikipedia:

> A feature toggle (also feature switch, feature flag, feature flipper, conditional feature, etc.) is a technique in software development that attempts to provide an alternative to maintaining multiple source-code branches (known as feature branches), such that a feature can be tested even before it is completed and ready for release. Feature toggle is used to hide, enable or disable the feature during run time. For example, during the development process, a developer can enable the feature for testing and disable it for other users.

Source:
https://en.wikipedia.org/wiki/Feature_toggle

For this task, we want to create feature flag to allow us to conduct an A/B test. Each flag document has:

```
{
    "name": "feature_foo", # Name of the feature
    "ratio": 0.5, # Percentage of users that should get the feature (50/50 in this case)
    "enabledEmails": ["bar@baz.com"], # List of emails the feature is always enabled for regardless of other criteria's
    "includedCountries": ["US"], # List of countries the user must be from, if empty it is enabled for all countries
    "excludedCountries": ["GB"], # List of countries the user cannot be from
}
```

Each user has the following information:

```
{
    "email":"foo@bar.com",
    "location":"GB"
}
```

Given the list of feature flags in `features.json` , your task is to create an API endpoint that returns a list of the features that are enabled for a given user’s email and location. A list of example users are included in `example_users.json`.

You can use any frameworks/libraries you like. Be sure to include tests and instructions on how to run the project.

# Submission

Clone this repository and make your commits to that (removing origin and making a new public repository) and send us the link to the repository when you are finished.

# Notes

This exercise should not take more than 3 hours. If you have any questions about the task, don’t hesitate to shoot us an e-mail at ed@zzish.com.
