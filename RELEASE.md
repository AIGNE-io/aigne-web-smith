### Releasing a Beta Version

To create a beta release, open a standard pull request. The `release-please` workflow will automatically create a separate pull request for the beta version. Merge the `release-please` PR when you are ready to release.

### Releasing a Production Version

To create a production release, manually run the "Create Release PR" GitHub Action. This will generate a new pull request for the production version. Merge this PR to publish the release.