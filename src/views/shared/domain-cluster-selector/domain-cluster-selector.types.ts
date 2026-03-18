import { type DomainDescription } from '@/views/domain-page/domain-page.types';

export type Props = {
  domainDescription: DomainDescription;
  cluster: string;
  buildPathForCluster?: (cluster: string) => string;
  singleClusterFallbackType?: 'label' | 'none';
  noSpacing?: boolean;
};

export type BuildDomainClusterPathParams = {
  domain: string;
  cluster: string;
  domainTab?: string;
};
