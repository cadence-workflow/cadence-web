import {
  type ExtendedDomainInfoEnabledConfig,
  type ExtendedDomainInfoEnabledResolverParams,
} from './extended-domain-info-enabled.types';

export default async function extendedDomainInfoEnabled(
  _: ExtendedDomainInfoEnabledResolverParams
): Promise<ExtendedDomainInfoEnabledConfig> {
  return {
    metadata: false,
    issues: false,
  };
}
