import { type ExtendedDomainInfoEnabledConfig } from './extended-domain-info-enabled.types';

export default async function extendedDomainInfoEnabled(): Promise<ExtendedDomainInfoEnabledConfig> {
  return {
    // TODO: @adhitya.mamallan - clean up this feature flag
    metadata:
      process.env.CADENCE_EXTENDED_DOMAIN_INFO_METADATA_ENABLED === 'true',
    // Unused feature flag
    issues: false,
  };
}
