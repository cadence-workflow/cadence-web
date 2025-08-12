# Cadence Web UI

[![Build Status](https://github.com/uber/cadence-web/actions/workflows/build.yml/badge.svg)](https://github.com/uber/cadence-web/actions/workflows/build.yml) [![Docker Status](https://github.com/uber/cadence-web/actions/workflows/docker_publish.yml/badge.svg)](https://hub.docker.com/r/ubercadence/web/tags)

Cadence is a distributed, scalable, durable, and highly available orchestration engine we developed at Uber Engineering to execute asynchronous long-running business logic in a scalable and resilient way.

This web UI is used to view workflows from [Cadence][cadence], see what's running, and explore and debug workflow executions.

## Getting Started

### Configuration

Set these environment variables if you need to change their defaults

| Variable                     | Description                                                                   | Default          |
| ---------------------------- | ----------------------------------------------------------------------------- | ---------------- |
| CADENCE_GRPC_PEERS           | Comma-delimited list of gRPC peers                                            | 127.0.0.1:7833   |
| CADENCE_GRPC_SERVICES_NAMES  | Comma-delimited list of gRPC services to call                                 | cadence-frontend |
| CADENCE_CLUSTERS_NAMES       | Comma-delimited list of cluster names                                         | cluster0         |
| CADENCE_WEB_PORT             | HTTP port to serve on                                                         | 8088             |
| CADENCE_WEB_HOSTNAME         | Host name to serve on                                                         | 0.0.0.0          |
| CADENCE_ADMIN_SECURITY_TOKEN | Admin token for accessing admin methods                                       | ''               |
| CADENCE_GRPC_TLS_CA_FILE     | Path to root CA certificate file for enabling one-way TLS on gRPC connections | ''               |

Note: To connect `cadence-web` to multiple clusters, you will need to add comma-delimted entries for `CADENCE_GRPC_PEERS`, `CADENCE_GRPC_SERVICES_NAMES` & `CADENCE_CLUSTERS_NAMES` for each cluster (each cluster values are grouped by their index within the Comma-delimited lists).

Example:

```
CADENCE_GRPC_PEERS=127.0.0.1:3000,127.0.0.1:5000 
CADENCE_GRPC_SERVICES_NAMES=cadence-frontend-cluster0,cadence-frontend-cluster1
CADENCE_CLUSTERS_NAMES=cluster0,cluster1
```

#### Feature flags

Feature flags control various UI features and functionality in `cadence-web`. These can be configured using environment variables.

| Feature                        | Description                                                                                                                                                             | Environment Variable Configuration                   | Minimum Cadence server Version          |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------- |
| Extended Domain Information    | Enhanced domain metadata display and help menu UI                                                                                                                       | `CADENCE_EXTENDED_DOMAIN_INFO_METADATA_ENABLED=true` | N/A                                     |
| Workflow Diagnostics           | Workflow diagnostics APIs and UI for debugging workflows                                                                                                                | `CADENCE_WORKFLOW_DIAGNOSTICS_ENABLED=true`          | 1.2.13+ (1.3.1+ for full functionality) |
| Enable Default Archival Search | Shows the default workflow search input + query input for archival workflows page. Default search is disabled by default as it doesn't work well with S3 implementation | `CADENCE_ARCHIVAL_DEFAULT_SEARCH_ENABLED=true`       | N/A                                     |


**Note:** For advanced customization, feature flags can be modified through resolvers in the dynamic config system ([`src/config/dynamic/resolvers`](src/config/dynamic/resolvers)).

### Using cadence-web

The latest version of `cadence-web` is included in the `cadence` composed docker containers in the [main Cadence repository][cadence]. Follow the instructions there to get started.

```
docker-compose -f docker/docker-compose.yml up
```

### Using TLS for gRPC

You can run cadence-web with secure gRPC TLS communication by passing your CA certificate file to the container and configure the environment variable accordingly.

#### Steps to Pass the Certificate File in Docker

1. **Prepare your CA certificate file:**  
   Ensure you have the root CA file (e.g., `ca.pem`) accessible on your host machine.

2. **Mount the certificate file into the container:**  
   Use Docker volume mounting (`-v` or `--volume`) to make the certificate file available inside the container at a known path.

3. **Set the `CADENCE_GRPC_TLS_CA_FILE` environment variable to the mounted certificate path:**  

Example command (for Linux):

```bash
docker run -it --rm \
  -p 8088:8088  \
  -v /path/on/host/ca.pem:/etc/certs/ca.pem:ro \
  -e CADENCE_GRPC_TLS_CA_FILE=/etc/certs/ca.pem \
  ubercadence/server:master-auto-setup
```

- Replace `/path/on/host/ca.pem` with the actual location of your CA certificate on the host system.
- `CADENCE_GRPC_TLS_CA_FILE` must point to the path inside the container where the certificate is mounted.

### Building & developing cadence-web

`cadence-web` requires node `v18` or greater to be able to run correctly.

#### Creating a production build

To create a production build, follow these steps:

1. Install npm packages and download idls

```
npm install && npm run install-idl && npm run generate:idl
```

2. Build the project files

```
npm run build
```

3. After building the code, start the server by running this command from the same directory as the build

```
npm start
```

4. Once the webapp is ready, access it through `localhost:8088` (port can be changed using `CADENCE_WEB_PORT` environment variable)

#### Running development environment

To run the development server, follow these steps:

1. Install npm packages and download idls

```
npm install && npm run install-idl && npm run generate:idl
```

2. Run the development server using

```
npm run dev
```

3. Once the webapp is ready, access it through `localhost:8088` (port can be changed using `CADENCE_WEB_PORT` environment variable)

Note: For contribution we recommend using dev containers, check [VSCode Dev Containers](#using-vscode-dev-containers) section for more information

#### Using VSCode Dev Containers

1. Set up the [Remote Containers plugin](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) in VSCode.
2. Open the cadence-web directory in VSCode.
3. Make sure to update `CADENCE_GRPC_PEERS` with the correct host. (If you are connecting to a server on a container host machine use `host.docker.internal:7833`, where `7833` is the gRPC port for a running [cadence-frontend](https://github.com/cadence-workflow/cadence/tree/master/service/frontend) service)
4. Use the Command Palette to select the 'Reopen folder in Container' option
5. Follow same commands listed in [Running development environment](#running-development-environment) section.

#### Developing cadence-web against cadence composed docker

To start development against dockerized cadence services, run the following command from the root of the project

```
docker-compose -f docker-compose-backend-services.yml up
```

You can customize the YAML file or reuse configurations from the [cadence repository](https://github.com/cadence-workflow/cadence/tree/master/docker). (In case of reusing exsisting files: ensure that cadence-web is not included in the composed container services, or just remove it)

After running `cadence`, start `cadence-web` for development using one of the previous methods ([Running development environment](#running-development-environment), [VSCode Dev Containers](#using-vscode-dev-containers))

#### NPM scripts

| script            | Description                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| build             | Generate a production build                                                                     |
| start             | Start server for existing production build                                                      |
| dev               | Run a development server                                                                        |
| install-idl       | Download idl files required for building/running the project                                    |
| generate:idl      | Move idl files inside the project and generate typescript types for them                        |
| test              | Run all test cases. To pass extra jest flags, use environment specific scripts e.g. test:unit:* |
| test:unit         | Run all unit tests. To pass extra jest flags, use environment specific scripts e.g. test:unit:* |
| test:unit:browser | Run only browser unit tests                                                                     |
| test:unit:node    | Run only node unit tests                                                                        |
| lint              | Run eslint                                                                                      |
| typecheck         | Run typescript checks                                                                           |

## License

Apache 2.0 License, please see [LICENSE](https://github.com/cadence-workflow/cadence-web/blob/master/LICENSE) for details.

[cadence]: https://github.com/cadence-workflow/cadence
