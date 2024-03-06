export type DomainCluster = {
  clusterName: string;
};

export type DomainInfo = {
  name: string;
  uuid: string;
};

export type ReplicationConfiguration = {
  activeClusterName: string;
  clusters: Array<DomainCluster>;
};

export type DomainData = {
  //ClientDashboardHref: string;
  clusters: [{ clusterName: string }];
  id: string;
  name: string;
};


export type SortingOrder = 'ASC' | 'DESC';

