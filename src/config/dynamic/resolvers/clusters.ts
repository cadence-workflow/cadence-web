import { type ClusterConfig } from './clusters.types';

const getArrayFromCommaSeparatedString = (
  str: string | undefined,
  defaultValue: string[]
) => {
  return str?.trim()
    ? str
        .split(',')
        .filter((c) => Boolean(c.trim()))
        .map((c) => c.trim())
    : defaultValue;
};

export default function clusters() {
  const clusterNames = getArrayFromCommaSeparatedString(
    process.env.CADENCE_CLUSTERS_NAMES,
    ['cluster0']
  );
  const peers = getArrayFromCommaSeparatedString(
    process.env.CADENCE_GRPC_PEERS,
    ['127.0.0.1:7833']
  );

  const serviceNames = getArrayFromCommaSeparatedString(
    process.env.CADENCE_GRPC_SERVICES_NAMES,
    ['cadence-frontend']
  );
  if (
    clusterNames.length !== peers.length ||
    clusterNames.length !== serviceNames.length
  ) {
    throw new Error(
      `Count mismatch in environment variables CADENCE_CLUSTERS_NAMES, CADENCE_GRPC_PEERS & CADENCE_GRPC_SERVICES_NAMES values. Recieved: ${clusterNames}(${clusterNames.length}), ${serviceNames}(${serviceNames.length}) & ${peers}(${peers.length}) respectively.`
    );
  }

  return clusterNames.map((clusterName, i) => {
    return {
      clusterName: clusterName,
      grpc: {
        peer: peers[i],
        serviceName: serviceNames[i],
        metadata: {},
      },
    } satisfies ClusterConfig;
  });
}
