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
    ['default']
  );
  const peers = getArrayFromCommaSeparatedString(
    process.env.CADENCE_GRPC_PEERS,
    ['127.0.0.1:7933']
  );

  const serviceNames = getArrayFromCommaSeparatedString(
    process.env.CADENCE_GRPC_SERVICES_NAMES,
    ['cadence-frontend']
  );

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
