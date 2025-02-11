# Cadence Web UI

[![Build Status](https://github.com/uber/cadence-web/actions/workflows/build.yml/badge.svg)](https://github.com/uber/cadence-web/actions/workflows/build.yml) [![Docker Status](https://github.com/uber/cadence-web/actions/workflows/docker_publish.yml/badge.svg)](https://hub.docker.com/r/ubercadence/web/tags)

Cadence is a distributed, scalable, durable, and highly available orchestration engine we developed at Uber Engineering to execute asynchronous long-running business logic in a scalable and resilient way.

This web UI is used to view workflows from [Cadence][cadence], see what's running, and explore and debug workflow executions.


## Getting Started

### Configuration

Set these environment variables if you need to change their defaults

| Variable                     | Description                                  | Default          |
| ---------------------------- | -------------------------------------------- | ---------------- |
| CADENCE_GRPC_PEERS           | Comma-delimited list of gRPC peers            | 127.0.0.1:7833   |
| CADENCE_GRPC_SERVICES_NAMES  | Comma-delimited list of gRPC services to call | cadence-frontend |
| CADENCE_CLUSTERS_NAMES       | Comma-delimited list of cluster names         | cluster0         |
| CADENCE_WEB_PORT             | HTTP port to serve on                        | 8088             |
| ENABLE_AUTH                  | Enable auth feature                          | false            |
| CADENCE_ADMIN_SECURITY_TOKEN | Admin token for accessing admin methods      | ''               |

Note: To connect `cadence-web` to multiple clusters, you will need to add comma-delimted entries for `CADENCE_GRPC_PEERS`, `CADENCE_GRPC_SERVICES_NAMES` & `CADENCE_CLUSTERS_NAMES` for each cluster (each cluster values are grouped by their index within the Comma-delimited lists).

Example:
```
CADENCE_GRPC_PEERS=127.0.0.1:3000,127.0.0.1:5000 
CADENCE_GRPC_SERVICES_NAMES=cadence-frontend-cluster0,cadence-frontend-cluster1
CADENCE_CLUSTERS_NAMES=cluster0,cluster1
```


### Using cadence-web

Latest version of `cadence-web` is included in `cadence` composed docker containers that can be found [here][cadence]. To start using it clone `cadence` repo and run the following command
```
docker-compose -f docker/docker-compose.yml up
```

### Building & developing cadence-web 

`cadence-web` requires node `v18` or greater to be able to run correctly.

#### Creating a production build

To create a production build, follow this steps:

1. Install npm packages and download idls
```
npm install && npm run install-idl && npm run generate:idl
```
2. Build the project files
```
npm run build
```
3. After building the code, the server can be started by running this command from the same directory that includes the build
```
npm start
```
4. The webapp can be accessed now through `localhost:8088` (port can be changed using `CADENCE_WEB_PORT` environment variable)

#### Running development environment

To run development server, follow this steps:

1. Install npm packages and download idls
```
npm install && npm run install-idl && npm run generate:idl
```
2. Run development server using
```
npm run dev
```
3. The webapp can be accessed now through `localhost:8088` (port can be changed using `CADENCE_WEB_PORT` environment variable)

Note: For contribution we recommend using dev containers, check [VSCode Dev Containers](#using-vscode-dev-containers) section for more information

#### Using VSCode Dev Containers

1. Set up the [Remote Containers plugin](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) in VSCode.
2. Open the cadence-web directory in VSCode.
3. Make sure to update `CADENCE_GRPC_PEERS` with the correct host. (If you are connecting to a server on a container host machine use `host.docker.interal:7833`, where `7833` is the gRPC port for a running [cadence-frontend](https://github.com/cadence-workflow/cadence/tree/master/service/frontend) service)
4. Use the Command Palette to select the 'Reopen folder in Container' option
5. Follow same commands listed in [Running development environment](#running-development-environment) section.


#### Developing cadence-web against cadence composed docker

To start development against a dockerized cadence services, run the following command from the root of the project
```
docker-compose -f docker-compose-backend-services.yml up
```

You can customize the YAML file or reuse configurations from the [cadence repository](https://github.com/cadence-workflow/cadence/tree/master/docker). (In case of reusing exsisting files: ensure that cadence-web is not included in the composed container services, or just remove it)

After running `cadence`, start `cadence-web` for development using one of the previous methods ([Running development environment](#running-development-environment),[VSCode Dev Containers](#using-vscode-dev-containers) )


#### NPM scripts

`build`: `Generates production builds`
`start`: `Starts a production build`
`dev`: `Run development server`
`install-idl`: `Downloads idl files required for building/running the project`
`generate:idl`: `Move idl files inside the project and generate typescript types for them`
`test`: `Run all test cases. To pass extra jest flags, use environment specific scripts e.g. test:unit:*`
`test:unit`: `Run all unit tests. To pass extra jest flags, use environment specific scripts e.g. test:unit:*`
`test:unit:browser`: `Run only browser unit tests`
`test:unit:node`: `Run only node unit tests`
`lint`: `Run eslint`
`typecheck`: `Run typescript checks`



## Licence

MIT License, please see [LICENSE](https://github.com/cadence-workflow/cadence-web/blob/master/LICENSE) for details.

[cadence]: https://github.com/cadence-workflow/cadence
