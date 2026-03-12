import { type DomainDescription } from '@/views/domain-page/domain-page.types';

export type Props = {
  domainDescription: DomainDescription;
  cluster: string;
  buildPathForCluster?: (cluster: string) => string;
  singleClusterRender?: 'label' | 'none';
  noSpacing?: boolean;
};
