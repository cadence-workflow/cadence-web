import clusters from './clusters';

export default function clustersPublic() {
  const originalClusters = clusters();
  return originalClusters.map((cluster) => {
    return {
      clusterName: cluster.clusterName,
    };
  });
}
