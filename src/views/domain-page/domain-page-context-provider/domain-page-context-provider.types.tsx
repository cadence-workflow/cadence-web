import { type PublicLoadedConfig } from '@/utils/config/config.types';

export type DomainPageContextType = {
  pageConfig: Pick<PublicLoadedConfig, 'CLUSTERS_PUBLIC'>;
};
