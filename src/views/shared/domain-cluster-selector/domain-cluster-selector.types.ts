import { type DomainDescription } from '@/views/domain-page/domain-page.types';

export type FormatClusterLabel = (
  clusterName: string,
  replicationStatusLabel: string | undefined
) => string;

export type Props = {
  domainDescription: DomainDescription;
  cluster: string;
  buildPathForCluster?: (cluster: string) => string;
  formatClusterLabel?: FormatClusterLabel;
  singleClusterFallbackType?: 'label' | 'none';
  noSpacing?: boolean;
};

export type BuildDomainClusterPathParams = {
  domain: string;
  cluster: string;
  domainTab?: string;
};
