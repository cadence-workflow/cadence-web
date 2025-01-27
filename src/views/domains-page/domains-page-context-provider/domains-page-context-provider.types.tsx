import { type PublicLoadedConfig } from '@/utils/config/config.types';

export type DomainsPageContextType = {
  pageConfig: Pick<PublicLoadedConfig, 'CLUSTERS_PUBLIC'>;
};
