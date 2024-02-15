# Developing Cadence's Web UI

This doc is intended for contributors to `cadence-web`

**Note:** All contributors will be asked to sign [Uber Contributor License Agreement](http://t.uber.com/cla) during the PR process.

## Development Environment

Node.js. Check [package.json](https://github.com/uber/cadence-web/blob/master/package.json) for the current version required. We do not recomment nvm since it can provide confusion with npm version.

For development we recommend using VSCode with [Remote Containers plugin](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers). We provide a default configuration for remote container using docker-compose.

You also need to run [cadence-server](https://github.com/uber/cadence) locally or have access to a cadence environment to talk to.

## Working with the source code

Follow [this great guide](https://gist.github.com/Chaser324/ce0505fbed06b947d962) on how to work with a GitHub fork and submit a pull request.
