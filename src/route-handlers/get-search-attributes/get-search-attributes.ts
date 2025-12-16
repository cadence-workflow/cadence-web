import { type NextRequest, NextResponse } from 'next/server';

import decodeUrlParams from '@/utils/decode-url-params';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import { SYSTEM_SEARCH_ATTRIBUTES } from './get-search-attributes.constants';
import {
  type GetSearchAttributesResponse,
  type Context,
  type RequestParams,
  type RouteParams,
} from './get-search-attributes.types';

export default async function getSearchAttributes(
  request: NextRequest,
  requestParams: RequestParams,
  ctx: Context
): Promise<Response> {
  const decodedParams = decodeUrlParams(requestParams.params) as RouteParams;
  const category = request.nextUrl.searchParams.get('category');

  try {
    const searchAttributesResponse =
      await ctx.grpcClusterMethods.getSearchAttributes({});

    let filteredKeys = searchAttributesResponse.keys || {};

    if (category === 'system') {
      filteredKeys = Object.fromEntries(
        Object.entries(filteredKeys).filter(([key]) =>
          SYSTEM_SEARCH_ATTRIBUTES.has(key)
        )
      );
    } else if (category === 'custom') {
      filteredKeys = Object.fromEntries(
        Object.entries(filteredKeys).filter(
          ([key]) => !SYSTEM_SEARCH_ATTRIBUTES.has(key)
        )
      );
    }

    return NextResponse.json({
      keys: filteredKeys,
    } satisfies GetSearchAttributesResponse);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: decodedParams, error: e },
      'Failed to fetch search attributes from Cadence service'
    );

    return NextResponse.json(
      {
        message:
          e instanceof GRPCError
            ? e.message
            : 'Failed to fetch search attributes',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
