import { type NextRequest, NextResponse } from 'next/server';
import queryString from 'query-string';

import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import filterIrrelevantDomains from './helpers/filter-irrelevant-domains';
import {
  type Context,
  type ListDomainsErrorResponse,
  type ListDomainsResponse,
  type RequestParams,
} from './list-domains.types';
import listDomainsQueryParamsSchema from './schemas/list-domains-query-params-schema';

export async function listDomains(
  request: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const { cluster } = requestParams.params;

  const { data: queryParams, error: validationError } =
    listDomainsQueryParamsSchema.safeParse(
      queryString.parse(request.nextUrl.searchParams.toString())
    );

  if (validationError) {
    return NextResponse.json(
      {
        error: 'Invalid argument(s) for domain listing',
        cluster,
        validationErrors: validationError.errors,
      } satisfies ListDomainsErrorResponse,
      { status: 400 }
    );
  }

  try {
    const { domains, nextPageToken } = await ctx.grpcClusterMethods.listDomains(
      {
        pageSize: queryParams.pageSize,
        nextPageToken: queryParams.nextPage,
      }
    );

    return NextResponse.json({
      domains: filterIrrelevantDomains(cluster, domains),
      nextPage: nextPageToken,
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
