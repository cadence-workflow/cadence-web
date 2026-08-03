import { type NextRequest, NextResponse } from 'next/server';

import { listDomains } from '@/route-handlers/list-domains/list-domains';
import { type ListDomainsErrorResponse } from '@/route-handlers/list-domains/list-domains.types';
import getConfigValue from '@/utils/config/get-config-value';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function GET(request: NextRequest) {
  const cluster = request.nextUrl.searchParams.get('cluster');

  const clusterConfigs = await getConfigValue('CLUSTERS');
  if (
    !cluster ||
    !clusterConfigs.some(({ clusterName }) => clusterName === cluster)
  ) {
    return NextResponse.json(
      {
        error: 'Invalid cluster provided',
        cluster: cluster ?? '',
      } satisfies ListDomainsErrorResponse,
      { status: 400 }
    );
  }

  return routeHandlerWithMiddlewares(
    listDomains,
    request,
    { params: { cluster } },
    routeHandlersDefaultMiddlewares
  );
}
