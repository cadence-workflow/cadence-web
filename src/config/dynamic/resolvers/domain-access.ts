import { type DescribeDomainResponse } from '@/route-handlers/describe-domain/describe-domain.types';
import { resolveAuthContext } from '@/utils/auth/auth-context';
import { getDomainAccessForUser } from '@/utils/auth/auth-shared';
import { FULL_ACCESS, NO_ACCESS } from '@/utils/auth/auth-shared.constants';
import logger from '@/utils/logger';
import request from '@/utils/request';

import {
  type DomainAccessResolverParams,
  type DomainAccessResolverValue,
} from './domain-access.types';

export default async function domainAccess({
  cluster,
  domain,
}: DomainAccessResolverParams): Promise<DomainAccessResolverValue> {
  const authContext = await resolveAuthContext();

  if (!authContext.authEnabled || authContext.isAdmin) {
    return FULL_ACCESS;
  }

  if (!authContext.auth.isValidToken) {
    return NO_ACCESS;
  }

  try {
    const domainDetails: DescribeDomainResponse = await request(
      `/api/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}`
    ).then((res) => res.json());

    if (!domainDetails) {
      return NO_ACCESS;
    }

    return getDomainAccessForUser(domainDetails, authContext);
  } catch (error) {
    logger.error({ error, cluster, domain }, 'Failed to resolve domain access');
    throw error;
  }
}
