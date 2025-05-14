import { type ExtendedDomainInfoEnabledConfig } from './extended-domain-info-enabled.types';

export default async function extendedDomainInfoEnabled(): Promise<ExtendedDomainInfoEnabledConfig> {
  return {
    metadata: true,
    issues: false,
  };
}
