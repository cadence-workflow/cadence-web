import { type NextRequest, NextResponse } from 'next/server';

import decodeUrlParams from '@/utils/decode-url-params';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import { SYSTEM_SEARCH_ATTRIBUTES } from './get-search-attributes.constants';
import {
  type Context,
  type RequestParams,
  type RouteParams,
  type SearchAttributesCategory,
} from './get-search-attributes.types';

export default async function getSearchAttributes(
  request: NextRequest,
  requestParams: RequestParams,
  ctx: Context
): Promise<Response> {
  const decodedParams = decodeUrlParams(requestParams.params) as RouteParams;
  const { searchParams } = new URL(request.url);
  const category = (searchParams.get('category') ||
    'all') as SearchAttributesCategory;

  try {
    // Fetch search attributes from Cadence RPC service
    const searchAttributesResponse =
      await ctx.grpcClusterMethods.getSearchAttributes({});

    // Filter the keys based on category parameter
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
      ...searchAttributesResponse,
      keys: filteredKeys,
    });
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
