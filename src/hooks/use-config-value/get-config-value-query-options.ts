import { queryOptions } from '@tanstack/react-query';
import queryString from 'query-string';

import {
  type GetConfigKeys,
  type GetConfigRequestQuery,
  type GetConfigResponse,
} from '@/route-handlers/get-config/get-config.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import { type UseConfigValueParams } from './use-config-value.types';

export default function getConfigValueQueryOptions<K extends GetConfigKeys>(
  params: UseConfigValueParams<K>
) {
  return queryOptions<
    GetConfigResponse<K>,
    RequestError,
    GetConfigResponse<K>,
    [string, GetConfigRequestQuery<K>]
  >({
    queryKey: [
      'dynamic_config',
      { configKey: params.key, jsonArgs: params.args },
    ],
    queryFn: ({ queryKey: [_, { configKey, jsonArgs }] }) =>
      request(
        queryString.stringifyUrl({
          url: '/api/config',
          query: {
            configKey,
            jsonArgs: JSON.stringify(jsonArgs),
          },
        }),
        {
          method: 'GET',
        }
      ).then((res) => res.json()),
  });
}
