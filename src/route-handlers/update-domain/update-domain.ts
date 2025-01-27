'use server';

import snakeCase from 'lodash/snakeCase';
import { NextResponse, type NextRequest } from 'next/server';

import getConfigValue from '@/utils/config/get-config-value';
import decodeUrlParams from '@/utils/decode-url-params';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import updateDomainValuesSchema from './schemas/update-domain-values-schema';
import { type Context, type RequestParams } from './update-domain.types';

export async function updateDomain(
  request: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const decodedParams = decodeUrlParams(requestParams.params);
  const requestBody = await request.json();
  const { data: values, error } =
    updateDomainValuesSchema.safeParse(requestBody);

  if (error) {
    return NextResponse.json(
      {
        message: 'Invalid values provided for domain update',
        validationErrors: error.errors,
      },
      { status: 400 }
    );
  }
  const ADMIN_SECURITY_TOKEN = await getConfigValue('ADMIN_SECURITY_TOKEN');
  try {
    const res = await ctx.grpcClusterMethods.updateDomain({
      ...values,
      name: decodedParams.domain,
      securityToken: ADMIN_SECURITY_TOKEN,
      updateMask: {
        paths: Object.keys(values).map(snakeCase),
      },
    });

    if (!res.domain) {
      return NextResponse.json(
        {
          message: 'Received empty response from domain update',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(res.domain);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: decodedParams, cause: e },
      'Error updating domain information'
    );

    return NextResponse.json(
      {
        message:
          e instanceof GRPCError
            ? e.message
            : 'Error updating domain information',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
