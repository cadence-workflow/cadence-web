import { NextResponse, type NextRequest } from 'next/server';

import getConfigValue from '@/utils/config/get-config-value';

import getConfigValueQueryParamsSchema from './schemas/get-config-query-params-schema';

export default async function getConfig(request: NextRequest) {
  const { data: queryParams, error } =
    getConfigValueQueryParamsSchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams)
    );

  if (error) {
    return NextResponse.json(
      {
        message: 'Invalid values provided for config key/args',
        cause: error.errors,
      },
      {
        status: 400,
      }
    );
  }

  const { configKey, jsonArgs } = queryParams;
  const res = await getConfigValue(configKey, jsonArgs);

  return NextResponse.json(res);
}
