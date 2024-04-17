const envClusterNames = process.env.NEXT_PUBLIC_CADENCE_CLUSTERS_NAMES;

const CLUSTER_NAMES: Array<string> = envClusterNames
  ? envClusterNames
      .split(',')
      .filter((c) => Boolean(c.trim()))
      .map((c) => c.trim())
  : ['default'];

export default CLUSTER_NAMES;
