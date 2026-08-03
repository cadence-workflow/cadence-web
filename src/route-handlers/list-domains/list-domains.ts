import { type NextRequest, NextResponse } from 'next/server';

import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import filterIrrelevantDomains from './helpers/filter-irrelevant-domains';
import { MAX_DOMAINS_TO_FETCH } from './list-domains.constants';
import {
  type Context,
  type ListDomainsErrorResponse,
  type ListDomainsResponse,
  type RequestParams,
} from './list-domains.types';

export async function listDomains(
  _: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const { cluster } = requestParams.params;

  try {
    const { domains } = await ctx.grpcClusterMethods.listDomains({
      pageSize: MAX_DOMAINS_TO_FETCH,
    });

    if (domains.length >= MAX_DOMAINS_TO_FETCH - 100) {
      logger.warn(
        {
          domainsCount: domains.length,
          maxDomainsCount: MAX_DOMAINS_TO_FETCH,
        },
        'Number of domains in cluster approaching/exceeds max number of domains that can be fetched'
      );
    }

    return NextResponse.json({
      domains: filterIrrelevantDomains(cluster, domains),
    } satisfies ListDomainsResponse);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: requestParams.params, error: e },
      `Failed to fetch domains for cluster ${cluster}` +
        (e instanceof GRPCError ? `: ${e.message}` : '')
    );

    return NextResponse.json(
      {
        error: e instanceof GRPCError ? e.message : 'Failed to fetch domains',
        cluster,
      } satisfies ListDomainsErrorResponse,
      { status: getHTTPStatusCode(e) }
    );
  }
}
