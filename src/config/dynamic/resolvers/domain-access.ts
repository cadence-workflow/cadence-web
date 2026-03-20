import {
  getGrpcMetadataFromAuth,
  resolveAuthContext,
} from '@/utils/auth/auth-context';
import { getDomainAccessForUser } from '@/utils/auth/auth-shared';
import { FULL_ACCESS, NO_ACCESS } from '@/utils/auth/auth-shared.constants';
import { getClusterMethods } from '@/utils/grpc/grpc-client';
import logger from '@/utils/logger';

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
    const clusterMethods = await getClusterMethods(
      cluster,
      getGrpcMetadataFromAuth(authContext)
    );
    const { domain: domainDetails } = await clusterMethods.describeDomain({
      name: domain,
    });

    if (!domainDetails) {
      return NO_ACCESS;
    }

    return getDomainAccessForUser(domainDetails, authContext);
  } catch (error) {
    logger.error({ error, cluster, domain }, 'Failed to resolve domain access');
    throw error;
  }
}
