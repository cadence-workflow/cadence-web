# Developing Cadence's Web UI

This doc is intended for contributors to `cadence-web`

> 📚 **New to contributing to Cadence?** Check out our [Contributing Guide](https://cadenceworkflow.io/community/how-to-contribute/getting-started) for an overview of the contribution process across all Cadence repositories. This document contains cadence-web specific setup and development instructions.

Once you go through the rest of this doc and get familiar with local development setup, feel free to start contributing!

Join our community on the CNCF Slack workspace at [cloud-native.slack.com](https://communityinviter.com/apps/cloud-native/cncf) in the **#cadence-users** channel to reach out and discuss issues with the team.

**Note:** All contributors will be asked to sign [Uber Contributor License Agreement](http://t.uber.com/cla) during the PR process.

## Development Environment

Node.js. Check [package.json](https://github.com/cadence-workflow/cadence-web/blob/master/package.json) for the current (engines > node) version required.

For development check the [Building & developing cadence-web](./README.md#building-&-developing-cadence-web)section

## Working with the source code

Follow [this great guide](https://gist.github.com/Chaser324/ce0505fbed06b947d962) on how to work with a GitHub fork and submit a pull request.

## Publish a personal Storybook preview

This step is optional. Use it share a preview of a new component, or a change to an existing one. You can deploy your fork to your own GitHub Pages site, giving you a shareable URL such as `https://<your-username>.github.io/cadence-web/`.

**Deploy a branch**

1. In your fork, open the Actions tab. The first time, click "I understand my workflows, go ahead and enable them".
2. Select the "Storybook Pages" workflow.
3. Run workflow, choose your branch, then Run workflow.
4. Wait 1 to 2 minutes for it to finish.
5. Open `https://<your-username>.github.io/cadence-web/`.

**One-time setup, after your first deploy**

1. In your fork, go to Settings, then Pages.
2. Under Build and deployment, set Source to "Deploy from a branch" (and not "GitHub Actions").
3. Set Branch to `gh-pages` and Folder to `/ (root)`, then Save.

The first deploy creates the `gh-pages` branch, which is why this comes second. GitHub can take up to 10 minutes to publish.

**Good to know**

- It only runs when you trigger it manually.
- It's one live site per fork; each run replaces what was there before.
