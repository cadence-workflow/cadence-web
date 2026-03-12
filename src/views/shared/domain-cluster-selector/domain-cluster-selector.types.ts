import { DomainDescription } from "@/views/domain-page/domain-page.types";

export type BuildPathForClusterParams = {
  newCluster: string;
  domainName: string;
  domainTab: string;
};

export type Props = {
  domainDescription: DomainDescription;
  cluster: string;
  getReplicationStatusLabel?: (
    domainDescription: DomainDescription,
    clusterName: string
  ) => string | undefined;
  buildPathForCluster?: (params: BuildPathForClusterParams) => string;
  singleClusterRender?: 'label' | 'none';
  noSpacing?: boolean;
};
